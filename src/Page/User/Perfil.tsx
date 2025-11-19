// src/Page/User/Perfil.tsx (LIMPO E CORRIGIDO)

import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { FiEdit2, FiCheck, FiUser, FiCalendar, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { FaUserEdit, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../Hook/AuthContext";
import { TbPlugConnected } from "react-icons/tb";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from "../../services/api";
import "../../styles/Perfil.css";
import VoltarParaInicio from "../../components/layout/VoltarParaInicio/VoltarParaInicio";

// --- Interfaces e Funções de Validação ---
interface Notification {
  type: 'success' | 'error' | 'alert';
  message: string;
}
const validarCPF = (cpf: string): boolean => {
  if (!cpf) return false;
  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11 || /^(\d)\1+$/.test(cpfLimpo)) {
    return false;
  }
  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;
  return true;
};
const validarCNPJ = (cnpj: string): boolean => {
  if (!cnpj) return false;
  const cnpjLimpo = cnpj.replace(/\D/g, "");
  if (cnpjLimpo.length !== 14 || /^(\d)\1+$/.test(cnpjLimpo)) {
    return false;
  }
  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  const digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  return true;
};
// --- Fim das Funções de Validação ---

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // --- States ---
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editando, setEditando] = useState(false);
  const [editandoDadosAdicionais, setEditandoDadosAdicionais] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [docError, setDocError] = useState("");
  const [cpfSocioError, setCpfSocioError] = useState("");
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");
  const [nomeError, setNomeError] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<"cpf" | "cnpj">("cpf");
  const [dadosPessoais, setDadosPessoais] = useState({
    cpf: "", cnpj: "", nomeCompleto: "", dataNascimento: "", telefone: "", endereco: ""
  });
  const [dadosOrganizacao, setDadosOrganizacao] = useState({
    razaoSocial: "", nomeFantasia: "", inscricaoMunicipal: "", cpfSocio: ""
  });
  const apiUrl = process.env.REACT_APP_API_URL;

  // 🔥 CORREÇÃO 1: Função renomeada para 'fetchProfileData'
  // E removida a chamada 'api.get(/api/users/me)' e 'updateUser'
  const fetchProfileData = useCallback(async () => {
    if (user?._id) {
      try {
        // Busca APENAS os dados do perfil
        const perfilRes = await api.get(`/api/perfil/${user._id}`);

        if (perfilRes.data) {
          const perfilData = perfilRes.data;

          // (Sua lógica de formatar data - está perfeita)
          let dataNascimentoFormatadaDDMMAAAA = "";
          const dataIsoBackend = perfilData.dadosPessoais?.dataNascimento;
          if (dataIsoBackend) {
            try {
              const dateObj = new Date(dataIsoBackend.substring(0, 10) + 'T00:00:00Z');
              if (!isNaN(dateObj.getTime())) {
                const dia = String(dateObj.getUTCDate()).padStart(2, '0');
                const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
                const ano = dateObj.getUTCFullYear();
                dataNascimentoFormatadaDDMMAAAA = `${dia}/${mes}/${ano}`;
              } else {
                console.warn("Data de nascimento inválida vinda do backend:", dataIsoBackend);
              }
            } catch (e) {
              console.error("Erro ao formatar data de nascimento do backend:", dataIsoBackend, e);
            }
          }

          // (Sua lógica de setar estados - está perfeita)
          setTipoPessoa(perfilData.tipoPessoa || "cpf");
          setDadosPessoais({
            cpf: formatCpf(perfilData.dadosPessoais?.cpf || ""),
            cnpj: formatCnpj(perfilData.dadosPessoais?.cnpj || ""),
            nomeCompleto: perfilData.dadosPessoais?.nomeCompleto || "",
            dataNascimento: dataNascimentoFormatadaDDMMAAAA,
            telefone: formatTelefone(perfilData.dadosPessoais?.telefone || ""),
            endereco: perfilData.dadosPessoais?.endereco || ""
          });
          setDadosOrganizacao(perfilData.dadosOrganizacao || {
            razaoSocial: "", nomeFantasia: "", inscricaoMunicipal: "", cpfSocio: ""
          });
        }
        // A LINHA 'updateUser(userRes.data);' FOI REMOVIDA (esta era a causa do flicker)
      } catch (error) {
        console.error("Erro ao recarregar dados do perfil:", error);
        setEditandoDadosAdicionais(true);
      }
    }
  }, [user?._id]); // 'updateUser' foi removido das dependências

  // LÓGICA PARA LER A URL E MOSTRAR NOTIFICAÇÕES
  useEffect(() => {
    const status = searchParams.get('status');
    const alertaDeRedirecionamento = location.state?.alerta;

    if (status === 'success') {
      setNotification({ type: 'success', message: 'Sua conta do Mercado Pago foi conectada com sucesso!' });
      fetchProfileData(); // 🔥 CORREÇÃO 2: Chamando o nome correto
      navigate('/perfil', { replace: true });
    } else if (status === 'error') {
      setNotification({ type: 'error', message: 'Ocorreu um erro ao tentar conectar sua conta. Por favor, tente novamente.' });
      navigate('/perfil', { replace: true });
    } else if (alertaDeRedirecionamento) {
      setNotification({ type: 'alert', message: alertaDeRedirecionamento });
      navigate('/perfil', { replace: true, state: {} });
    }
  }, [searchParams, location.state, navigate, fetchProfileData]); // 🔥 CORREÇÃO 3: Dependência correta

  // --- Funções de formatação ---
  const formatCpf = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
  };
  const formatCnpj = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    return value;
  };
  const formatTelefone = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1)$2");
    value = value.replace(/(\d{5})(\d)/g, "$1-$2");
    return value;
  };
  const getImagemPerfilUrl = useCallback((imagemPerfil?: string) => {
    if (!imagemPerfil) return `${apiUrl}/uploads/blank_profile.png`;
    if (imagemPerfil.startsWith('http') || imagemPerfil.startsWith('data:image')) return imagemPerfil;
    if (imagemPerfil.startsWith('/uploads')) return `${apiUrl}${imagemPerfil}`;
    return `${apiUrl}/uploads/perfil-img/${imagemPerfil}`;
  }, [apiUrl]);

  // Efeito para carregar os dados iniciais do usuário
  useEffect(() => {
    if (user?._id) {
      setNome(user.nome);
      setPreviewUrl(getImagemPerfilUrl(user.imagemPerfil));
      fetchProfileData(); // 🔥 CORREÇÃO 4: Chamando o nome correto
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fetchProfileData, getImagemPerfilUrl]); // Atualizado para incluir as dependências corretas

  // --- Outros useEffects e Handlers ---
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => { setShowSuccessModal(false); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const validateNome = (nomeValue: string): boolean => {
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(nomeValue.trim())) {
      setNomeError("Nome deve conter apenas letras e espaços (2-50 caracteres).");
      return false;
    }
    setNomeError("");
    return true;
  };

  const handleSalvarLogin = async () => {
    if (!user || !validateNome(nome)) return;
    const formData = new FormData();
    formData.append("nome", nome.trim());
    if (imagem) formData.append("imagemPerfil", imagem);
    try {
      const response = await fetch(`${apiUrl}/api/users/updateByEmail/${user.email}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Erro ao atualizar perfil.");
      const data = await response.json();
      updateUser(data.user);
      setSuccessMessage("Nome e foto de perfil atualizados com sucesso!");
      setShowSuccessModal(true);
      setEditando(false);
      setImagem(null);
    } catch (error) {
      console.error("Erro ao atualizar os dados de login:", error);
    }
  };

  const handleSalvarDadosAdicionais = async () => {
    if (!user?._id) return;
    let hasError = false;
    if (tipoPessoa === "cpf") {
      const cpfLimpo = dadosPessoais.cpf.replace(/\D/g, "");
      if (cpfLimpo.length === 0) {
        setDocError("O CPF é obrigatório.");
        hasError = true;
      } else if (!validarCPF(cpfLimpo)) {
        setDocError("CPF inválido. Verifique os dígitos.");
        hasError = true;
      } else {
        setDocError("");
      }
    } else { // tipoPessoa === "cnpj"
      const cnpjLimpo = dadosPessoais.cnpj.replace(/\D/g, "");
      if (cnpjLimpo.length === 0) {
        setDocError("O CNPJ é obrigatório.");
        hasError = true;
      } else if (!validarCNPJ(cnpjLimpo)) {
        setDocError("CNPJ inválido. Verifique os dígitos.");
        hasError = true;
      } else {
        setDocError("");
      }
      const cpfSocioLimpo = dadosOrganizacao.cpfSocio.replace(/\D/g, "");
      if (cpfSocioLimpo.length === 0) {
        setCpfSocioError("O CPF do Sócio é obrigatório.");
        hasError = true;
      } else if (!validarCPF(cpfSocioLimpo)) {
        setCpfSocioError("CPF do Sócio inválido. Verifique os dígitos.");
        hasError = true;
      } else {
        setCpfSocioError("");
      }
    }
    let dataNascimentoParaSalvar = "";
    const dataFormatadaInput = dadosPessoais.dataNascimento;
    if (dataFormatadaInput && /^\d{2}\/\d{2}\/\d{4}$/.test(dataFormatadaInput)) {
      const parts = dataFormatadaInput.split('/');
      dataNascimentoParaSalvar = `${parts[2]}-${parts[1]}-${parts[0]}`;
      const dateObj = new Date(dataNascimentoParaSalvar + 'T00:00:00Z');
      if (isNaN(dateObj.getTime())) {
        alert("Data de nascimento inválida. Verifique o dia, mês e ano.");
        hasError = true;
      } else {
        const hoje = new Date();
        const dataMinimaNascimento = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
        if (dateObj.getTime() > dataMinimaNascimento.getTime()) {
          const labelData = tipoPessoa === 'cpf' ? 'nascimento' : 'nascimento do Sócio';
          alert(`É necessário ter pelo menos 18 anos para se cadastrar (data de ${labelData}).`);
          hasError = true;
        }
      }
    } else if (dataFormatadaInput) {
      alert("Formato da data de nascimento inválido. Use DD/MM/AAAA.");
      hasError = true;
    } else {
      alert("A data de nascimento é obrigatória.");
      hasError = true;
    }
    if (hasError) return;
    const dadosParaSalvar = {
      tipoPessoa,
      dadosPessoais: {
        ...dadosPessoais,
        cpf: dadosPessoais.cpf.replace(/\D/g, ""),
        cnpj: dadosPessoais.cnpj.replace(/\D/g, ""),
        telefone: dadosPessoais.telefone.replace(/\D/g, ""),
        dataNascimento: dataNascimentoParaSalvar
      },
      dadosOrganizacao: { ...dadosOrganizacao, cpfSocio: dadosOrganizacao.cpfSocio.replace(/\D/g, "") }
    };
    try {
      const response = await fetch(`${apiUrl}/api/perfil/salvar/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaSalvar),
      });
      if (!response.ok) throw new Error("Erro ao salvar dados de perfil.");
      setSuccessMessage("Dados pessoais atualizados com sucesso!");
      setShowSuccessModal(true);
      setEditandoDadosAdicionais(false);

      fetchProfileData(); // 🔥 CORREÇÃO 5: Chamando o nome correto

    } catch (error) {
      console.error("Erro ao salvar os dados de perfil:", error);
    }
  };

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const novoNome = e.target.value;
    setNome(novoNome);
    if (editando) validateNome(novoNome);
  };

  const handleConnectMercadoPago = async () => {
    if (!user) return;
    try {
      const response = await api.post('/api/mercadopago/connect', { userId: user._id });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Erro ao iniciar conexão com Mercado Pago:", error);
      setNotification({ type: 'error', message: 'Não foi possível iniciar a conexão. Tente novamente.' });
    }
  };

  const handleDisconnectMercadoPago = async () => {
    setShowDisconnectModal(true);
  };

  const confirmAndDisconnect = async () => {
    if (user) {
      try {
        await api.patch('/api/mercadopago/disconnect');
        setNotification({ type: 'success', message: 'Sua conta do Mercado Pago foi desvinculada com sucesso.' });
        fetchProfileData(); // 🔥 CORREÇÃO 6: Chamando o nome correto
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Não foi possível desvincular a conta. Tente novamente.';
        setNotification({ type: 'error', message: errorMessage });
      } finally {
        setShowDisconnectModal(false);
      }
    }
  };

  const formatDataNascimento = (value: string): string => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.slice(0, 8);
    if (value.length > 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    return value;
  };

  if (isLoading) return <div className="perfil-loading">Carregando perfil...</div>;
  if (!user) return <div className="perfil-error">Usuário não encontrado. Por favor, faça login.</div>;

  const docLabel = tipoPessoa === "cpf" ? "CPF" : "CNPJ";
  const docPlaceholder = tipoPessoa === "cpf" ? "000.000.000-00" : "00.000.000/0000-00";
  const docMaxLength = tipoPessoa === "cpf" ? 14 : 18;

  // --- JSX de Retorno ---
  return (
    <>
    <VoltarParaInicio />
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais e de pagamento.</p>
        </div>

        {notification && (
          <div className={`notification notification--${notification.type}`}>
            {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            {notification.message}
          </div>
        )}

        <div className="perfil-card full-width">
          <div className="perfil-header-secondary">
            <TbPlugConnected className="perfil-tab-icon" />
            <h3>Conexão de Pagamento</h3>
          </div>
          <div className="perfil-tab-content">
            {user.mercadoPagoAccountId ? (
              <div className="perfil-connection-status connected">
                <FaCheckCircle />
                <div>
                  <p>Sua conta do Mercado Pago está conectada!</p>
                  <small><strong>ID da Conta:</strong> {user.mercadoPagoAccountId}</small>
                  <br></br>
                  <button onClick={handleDisconnectMercadoPago} className="btn-desvincular">
                    Desvincular Conta
                  </button>
                </div>
              </div>
            ) : (
              <div className="perfil-connection-status disconnected">
                <p>Para vender ingressos e receber pagamentos, conecte sua conta do Mercado Pago.</p>
                <button className="perfil-btn-primary" onClick={handleConnectMercadoPago}>
                  Conectar ao Mercado Pago
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="perfil-content">
          <div className="perfil-left">
            <div className="perfil-card">
              <div className="perfil-avatar-section">
                <div className="perfil-avatar-wrapper">
                  <img
                    src={previewUrl || getImagemPerfilUrl(user?.imagemPerfil)}
                    alt="Foto de perfil"
                    className="perfil-avatar"
                    loading="eager"
                    onError={(e) => { e.currentTarget.src = `${apiUrl}/uploads/blank_profile.png`; }}
                  />
                  {editando && (
                    <label htmlFor="upload-avatar" className="perfil-avatar-edit">
                      <FiCamera />
                      <input id="upload-avatar" type="file" accept="image/*" onChange={handleImagemChange} style={{ display: "none" }} />
                    </label>
                  )}
                </div>
                <h2>{nome || user.nome}</h2>
                <p className="perfil-email">{user.email}</p>
              </div>
              <div className="perfil-form-group">
                <label className="perfil-input-label">
                  <FiUser className="perfil-input-icon" />
                  <span>Nome completo</span>
                </label>
                <input
                  type="text"
                  className={`perfil-input ${nomeError ? 'perfil-input-error' : ''}`}
                  disabled={!editando}
                  value={nome}
                  onChange={handleNomeChange}
                  placeholder="Digite seu nome completo"
                />
                {nomeError && (<div className="perfil-error-message">{nomeError}</div>)}
              </div>
              <div className="perfil-form-group">
                <label className="perfil-input-label">
                  <FiMail className="perfil-input-icon" />
                  <span>Email</span>
                </label>
                <input type="email" className="perfil-input" disabled value={user.email} />
              </div>
              <button
                className={`perfil-btn-primary ${editando ? 'perfil-btn-save' : ''}`}
                onClick={() => { if (editando) handleSalvarLogin(); else { setEditando(true); setNomeError(""); } }}
              >
                {editando ? <FiCheck /> : <FiEdit2 />}
                {editando ? "Salvar login" : "Editar perfil"}
              </button>
            </div>
          </div>
          <div className="perfil-right">
            <div className="perfil-card">
              <div className="perfil-header-secondary">
                <FaUserEdit className="perfil-tab-icon" />
                <h3>Dados Pessoais</h3>
              </div>
              <div className="perfil-tab-content">
                <div className="perfil-form-grid">
                  <div className="perfil-form-group full-width">
                    <div className="perfil-input-label" style={{ marginBottom: 10 }}>
                      <FiUser className="perfil-input-icon" />
                      <span>Tipo de documento</span>
                    </div>
                    <div className="perfil-radio-group" role="radiogroup" aria-label="Tipo de documento">
                      <label className="perfil-radio-pill">
                        <input type="radio" name="tipoPessoa" value="cpf" checked={tipoPessoa === "cpf"}
                          onChange={() => {
                            setTipoPessoa("cpf");
                            setDocError(""); // Limpa o erro
                            setDadosPessoais(prev => ({ ...prev, cnpj: "" }));
                          }}
                          disabled={!editandoDadosAdicionais} />
                        <span>CPF</span>
                      </label>
                      <label className="perfil-radio-pill">
                        <input type="radio" name="tipoPessoa" value="cnpj" checked={tipoPessoa === "cnpj"}
                          onChange={() => {
                            setTipoPessoa("cnpj");
                            setDocError("");
                            setDadosPessoais(prev => ({ ...prev, cpf: "" }));
                            setCpfSocioError("");
                          }}
                          disabled={!editandoDadosAdicionais} />
                        <span>CNPJ</span>
                      </label>
                    </div>
                  </div>
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>{docLabel}</span>
                    </label>
                    <input
                      className={`perfil-input ${docError ? 'perfil-input-error' : ''}`}
                      placeholder={docPlaceholder}
                      inputMode="numeric"
                      maxLength={docMaxLength}
                      value={tipoPessoa === "cpf" ? dadosPessoais.cpf : dadosPessoais.cnpj}
                      onChange={(e) => {
                        const value = e.target.value;
                        const cleanValue = value.replace(/\D/g, "");
                        let formattedValue = "";

                        if (tipoPessoa === "cpf") {
                          formattedValue = formatCpf(value);
                          setDadosPessoais(prevState => ({ ...prevState, cpf: formattedValue }));
                          if (cleanValue.length === 11) {
                            setDocError(validarCPF(cleanValue) ? "" : "CPF inválido.");
                          } else if (cleanValue.length > 0) {
                            setDocError("CPF incompleto.");
                          } else {
                            setDocError("");
                          }
                        } else { // tipoPessoa === "cnpj"
                          formattedValue = formatCnpj(value);
                          setDadosPessoais(prevState => ({ ...prevState, cnpj: formattedValue }));
                          if (cleanValue.length === 14) {
                            setDocError(validarCNPJ(cleanValue) ? "" : "CNPJ inválido.");
                          } else if (cleanValue.length > 0) {
                            setDocError("CNPJ incompleto.");
                          } else {
                            setDocError("");
                          }
                        }
                      }}
                      disabled={!editandoDadosAdicionais}
                    />
                    {docError && (<div className="perfil-error-message">{docError}</div>)}
                  </div>
                  {tipoPessoa === "cpf" && (
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiCalendar className="perfil-input-icon" />
                        <span>Data de nascimento</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="DD/MM/AAAA"
                        maxLength={10}
                        className="perfil-input"
                        value={dadosPessoais.dataNascimento}
                        onChange={(e) => {
                          const formattedValue = formatDataNascimento(e.target.value);
                          setDadosPessoais(prevState => ({ ...prevState, dataNascimento: formattedValue }));
                        }}
                        disabled={!editandoDadosAdicionais}
                      /> </div>
                  )}
                  {tipoPessoa === "cnpj" && (
                    <>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiUser className="perfil-input-icon" />
                          <span>Razão Social</span>
                        </label>
                        <input
                          className="perfil-input"
                          placeholder="Ex: Empresa de Eventos Ltda."
                          value={dadosOrganizacao.razaoSocial}
                          onChange={(e) => setDadosOrganizacao(prev => ({ ...prev, razaoSocial: e.target.value }))}
                          disabled={!editandoDadosAdicionais}
                        />
                      </div>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiUser className="perfil-input-icon" />
                          <span>Nome Fantasia</span>
                        </label>
                        <input
                          className="perfil-input"
                          placeholder="Ex: Nome Popular da Marca"
                          value={dadosOrganizacao.nomeFantasia}
                          onChange={(e) => setDadosOrganizacao(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                          disabled={!editandoDadosAdicionais}
                        />
                      </div>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiUser className="perfil-input-icon" />
                          <span>Inscrição Municipal</span>
                        </label>
                        <input
                          className="perfil-input"
                          maxLength={15}
                          placeholder="Ex: 12345678 ou 001.234-A"
                          value={dadosOrganizacao.inscricaoMunicipal}
                          onChange={(e) => setDadosOrganizacao(prev => ({ ...prev, inscricaoMunicipal: e.target.value }))}
                          disabled={!editandoDadosAdicionais}
                        />
                      </div>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiUser className="perfil-input-icon" />
                          <span>CPF do Sócio/Representante</span>
                        </label>
                        <input
                          className={`perfil-input ${cpfSocioError ? 'perfil-input-error' : ''}`}
                          placeholder="000.000.000-00"
                          inputMode="numeric"
                          maxLength={14}
                          value={dadosOrganizacao.cpfSocio}
                          onChange={(e) => {
                            const formattedCpf = formatCpf(e.target.value);
                            setDadosOrganizacao(prev => ({ ...prev, cpfSocio: formattedCpf }));
                            const cleanCpf = formattedCpf.replace(/\D/g, "");
                            if (cleanCpf.length === 11) {
                              setCpfSocioError(validarCPF(cleanCpf) ? "" : "CPF do Sócio inválido.");
                            } else if (cleanCpf.length > 0) {
                              setCpfSocioError("CPF do Sócio incompleto.");
                            } else {
                              setCpfSocioError("");
                            }
                          }}
                          disabled={!editandoDadosAdicionais}
                        />
                        {cpfSocioError && (<div className="perfil-error-message">{cpfSocioError}</div>)}
                      </div>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiUser className="perfil-input-icon" />
                          <span>Nome completo do Sócio/Representante</span>
                        </label>
                        <input
                          className="perfil-input"
                          value={dadosPessoais.nomeCompleto}
                          onChange={(e) => setDadosPessoais(prev => ({ ...prev, nomeCompleto: e.target.value }))}
                          disabled={!editandoDadosAdicionais}
                        />
                      </div>
                      <div className="perfil-form-group">
                        <label className="perfil-input-label">
                          <FiCalendar className="perfil-input-icon" />
                          <span>Data de nascimento do Sócio</span>
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="DD/MM/AAAA"
                          maxLength={10}
                          className="perfil-input"
                          value={dadosPessoais.dataNascimento}
                          onChange={(e) => {
                            const formattedValue = formatDataNascimento(e.target.value);
                            setDadosPessoais(prev => ({ ...prev, dataNascimento: formattedValue }));
                          }}
                          disabled={!editandoDadosAdicionais}
                        />
                      </div>
                    </>
                  )}
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiPhone className="perfil-input-icon" />
                      <span>Telefone</span>
                    </label>
                    <input
                      className="perfil-input"
                      placeholder="(99) 99999-9999"
                      inputMode="numeric"
                      maxLength={15}
                      value={dadosPessoais.telefone}
                      onChange={(e) => {
                        const formattedValue = formatTelefone(e.target.value);
                        setDadosPessoais(prevState => ({ ...prevState, telefone: formattedValue }));
                      }}
                      disabled={!editandoDadosAdicionais}
                    />
                  </div>
                </div>
              </div>
              <button
                className={`perfil-btn-primary ${editandoDadosAdicionais ? 'perfil-btn-save' : ''}`}
                onClick={() => { if (editandoDadosAdicionais) { handleSalvarDadosAdicionais(); } else { setEditandoDadosAdicionais(true); } }}
                style={{ marginTop: '20px' }}
              >
                {editandoDadosAdicionais ? <FiCheck /> : <FiEdit2 />}
                {editandoDadosAdicionais ? "Salvar Dados" : "Editar Dados"}
              </button>
            </div>
          </div>
        </div>
        {showSuccessModal && (
          <div className="perfil-modal-overlay">
            <div className="perfil-modal">
              <div className="perfil-modal-content">
                <div className="perfil-modal-icon"><FiCheck /></div>
                <h3 className="perfil-modal-title">Sucesso!</h3>
                <p className="perfil-modal-message">{successMessage}</p>
                <div className="perfil-modal-progress"><div className="perfil-modal-progress-bar"></div></div>
              </div>
            </div>
          </div>
        )}
        {showDisconnectModal && (
          <div className="perfil-modal-overlay">
            <div className="perfil-modal">
              <div className="perfil-modal-content">
                <div className="perfil-modal-icon-alert"><FaExclamationTriangle /></div>
                <h3 className="perfil-modal-title">Confirmar Desvinculação</h3>
                <p className="perfil-modal-message">
                  Você tem certeza que deseja desvincular sua conta do Mercado Pago?
                  <br /><br />
                  <strong>Aviso:</strong> Você não poderá criar novos eventos e as vendas de eventos futuros poderão ser pausadas.
                </p>
                <div className="perfil-modal-footer">
                  <button
                    className="perfil-btn-secondary"
                    onClick={() => setShowDisconnectModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="perfil-btn-danger"
                    onClick={confirmAndDisconnect}
                  >
                    Sim, desvincular
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Perfil;