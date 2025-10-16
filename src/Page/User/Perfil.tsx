import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { FiEdit2, FiCheck, FiUser, FiCalendar, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { FaUserEdit, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../Hook/AuthContext";
import { TbPlugConnected } from "react-icons/tb";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import api from "../../services/api";
import "../../styles/Perfil.css";

interface Notification {
  type: 'success' | 'error' | 'alert';
  message: string;
}

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [notification, setNotification] = useState<Notification | null>(null);
  const [editando, setEditando] = useState(false);
  const [editandoDadosAdicionais, setEditandoDadosAdicionais] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

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

  // Função centralizada e segura para buscar os dados
  const fetchProfileAndUser = useCallback(async () => {
    if (user?._id) {
      try {
        const [perfilRes, userRes] = await Promise.all([
          api.get(`/api/perfil/${user._id}`),
          api.get(`/api/users/me`)
        ]);

        if (perfilRes.data) {
          const perfilData = perfilRes.data;
          const dataNascimentoFormatada = perfilData.dadosPessoais?.dataNascimento ? new Date(perfilData.dadosPessoais.dataNascimento).toISOString().slice(0, 10) : "";

          setTipoPessoa(perfilData.tipoPessoa || "cpf");
          setDadosPessoais({
            cpf: formatCpf(perfilData.dadosPessoais?.cpf || ""),
            cnpj: formatCnpj(perfilData.dadosPessoais?.cnpj || ""),
            nomeCompleto: perfilData.dadosPessoais?.nomeCompleto || "",
            dataNascimento: dataNascimentoFormatada,
            telefone: formatTelefone(perfilData.dadosPessoais?.telefone || ""),
            endereco: perfilData.dadosPessoais?.endereco || ""
          });
          setDadosOrganizacao(perfilData.dadosOrganizacao || {
            razaoSocial: "", nomeFantasia: "", inscricaoMunicipal: "", cpfSocio: ""
          });
        }
        updateUser(userRes.data);
      } catch (error) {
        console.error("Erro ao recarregar dados do perfil:", error);
        setEditandoDadosAdicionais(true);
      }
    }
  }, [user?._id, updateUser]);


  // LÓGICA PARA LER A URL E MOSTRAR NOTIFICAÇÕES
  useEffect(() => {
    const status = searchParams.get('status');
    const alertaDeRedirecionamento = location.state?.alerta;

    if (status === 'success') {
      setNotification({ type: 'success', message: 'Sua conta do Mercado Pago foi conectada com sucesso!' });
      fetchProfileAndUser();
      navigate('/perfil', { replace: true });
    } else if (status === 'error') {
      setNotification({ type: 'error', message: 'Ocorreu um erro ao tentar conectar sua conta. Por favor, tente novamente.' });
      navigate('/perfil', { replace: true });
    } else if (alertaDeRedirecionamento) {
      setNotification({ type: 'alert', message: alertaDeRedirecionamento });
      navigate('/perfil', { replace: true, state: {} });
    }
  }, [searchParams, location.state, navigate, fetchProfileAndUser]);

  // Funções de formatação
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
      fetchProfileAndUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

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

    const dadosParaSalvar = {
      tipoPessoa,
      dadosPessoais: { ...dadosPessoais, cpf: dadosPessoais.cpf.replace(/\D/g, ""), cnpj: dadosPessoais.cnpj.replace(/\D/g, ""), telefone: dadosPessoais.telefone.replace(/\D/g, "") },
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
        fetchProfileAndUser();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Não foi possível desvincular a conta. Tente novamente.';
        setNotification({ type: 'error', message: errorMessage });
      } finally {
        // Fecha a modal, independentemente do resultado
        setShowDisconnectModal(false);
      }
    }
  };

  if (isLoading) return <div className="perfil-loading">Carregando perfil...</div>;
  if (!user) return <div className="perfil-error">Usuário não encontrado. Por favor, faça login.</div>;

  const docLabel = tipoPessoa === "cpf" ? "CPF" : "CNPJ";
  const docPlaceholder = tipoPessoa === "cpf" ? "000.000.000-00" : "00.000.000/0000-00";
  const docMaxLength = tipoPessoa === "cpf" ? 14 : 18;

  return (
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
                      <input type="radio" name="tipoPessoa" value="cpf" checked={tipoPessoa === "cpf"} onChange={() => setTipoPessoa("cpf")} disabled={!editandoDadosAdicionais} />
                      <span>CPF</span>
                    </label>
                    <label className="perfil-radio-pill">
                      <input type="radio" name="tipoPessoa" value="cnpj" checked={tipoPessoa === "cnpj"} onChange={() => setTipoPessoa("cnpj")} disabled={!editandoDadosAdicionais} />
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
                    className="perfil-input"
                    placeholder={docPlaceholder}
                    inputMode="numeric"
                    maxLength={docMaxLength}
                    value={tipoPessoa === "cpf" ? dadosPessoais.cpf : dadosPessoais.cnpj}
                    onChange={(e) => {
                      const formattedValue = tipoPessoa === "cpf" ? formatCpf(e.target.value) : formatCnpj(e.target.value);
                      setDadosPessoais(prevState => ({
                        ...prevState,
                        [tipoPessoa]: formattedValue
                      }));
                    }}
                    disabled={!editandoDadosAdicionais}
                  />
                </div>
                {tipoPessoa === "cpf" && (
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiCalendar className="perfil-input-icon" />
                      <span>Data de nascimento</span>
                    </label>
                    <input type="date" className="perfil-input" value={dadosPessoais.dataNascimento} onChange={(e) => setDadosPessoais(prevState => ({ ...prevState, dataNascimento: e.target.value }))} disabled={!editandoDadosAdicionais} />
                  </div>
                )}

                {/* AQUI ESTÃO OS CAMPOS RESTAURADOS DO CNPJ */}
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
                        className="perfil-input"
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        maxLength={14}
                        value={dadosOrganizacao.cpfSocio}
                        onChange={(e) => {
                          const formattedCpf = formatCpf(e.target.value);
                          setDadosOrganizacao(prev => ({ ...prev, cpfSocio: formattedCpf }));
                        }}
                        disabled={!editandoDadosAdicionais}
                      />
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
                        type="date"
                        className="perfil-input"
                        value={dadosPessoais.dataNascimento}
                        onChange={(e) => setDadosPessoais(prev => ({ ...prev, dataNascimento: e.target.value }))}
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
  );
};

export default Perfil;