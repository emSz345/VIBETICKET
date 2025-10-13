import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import { FiEdit2, FiCheck, FiUser, FiCalendar, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { useAuth } from "../../Hook/AuthContext";
import { TbPlugConnected } from "react-icons/tb";
import "../../styles/Perfil.css";
import { FaUserEdit } from "react-icons/fa";

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();

  const [editando, setEditando] = useState(false);
  const [editandoDadosAdicionais, setEditandoDadosAdicionais] = useState(false);
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");
  
  // ESTADO PARA ERROS DO NOME
  const [nomeError, setNomeError] = useState("");

  const [_hasPerfilSaved, setHasPerfilSaved] = useState(false);

  const [tipoPessoa, setTipoPessoa] = useState<"cpf" | "cnpj">("cpf");
  const docLabel = tipoPessoa === "cpf" ? "CPF" : "CNPJ";
  const docPlaceholder = tipoPessoa === "cpf" ? "000.000.000-00" : "00.000.000/0000-00";
  const docMaxLength = tipoPessoa === "cpf" ? 14 : 18;

  // --- ESTADO PARA O MODAL ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [dadosPessoais, setDadosPessoais] = useState({
    cpf: "",
    cnpj: "",
    nomeCompleto: "",
    dataNascimento: "",
    telefone: "",
    endereco: ""
  });

  const [dadosOrganizacao, setDadosOrganizacao] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoMunicipal: "",
    cpfSocio: ""
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  // --- ESTADOS PARA O MERCADO PAGO ---
  const [mercadopagoConnected, setMercadopagoConnected] = useState(false);
  const [mercadopagoAccountId, setMercadopagoAccountId] = useState("");

  // FUNÇÃO DE VALIDAÇÃO DO NOME
  const validateNome = (nome: string): boolean => {
    if (!/^[a-zA-ZÀ-ÿ\s]{2,50}$/.test(nome.trim())) {
      setNomeError("Nome deve conter apenas letras e espaços (2-50 caracteres).");
      return false;
    }
    setNomeError("");
    return true;
  };

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

  const cleanInscricaoMunicipal = (value: string) => {
    return value.replace(/[^a-zA-Z0-9]/g, "");
  };

  const formatTelefone = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1)$2");
    value = value.replace(/(\d{5})(\d)/g, "$1-$2");
    return value;
  };

  // FUNÇÃO CORRIGIDA PARA TRATAR IMAGENS DO GOOGLE
  const getImagemPerfilUrl = useCallback((imagemPerfil?: string) => {
    if (!imagemPerfil) return `${apiUrl}/uploads/blank_profile.png`;

    // Se já é uma URL completa (Google, Facebook, etc), retorna diretamente
    if (imagemPerfil.startsWith('http')) {
      return imagemPerfil;
    }

    // Se começa com /uploads, adiciona o apiUrl
    if (imagemPerfil.startsWith('/uploads')) {
      return `${apiUrl}${imagemPerfil}`;
    }

    // Caso contrário, assume que é um arquivo local em uploads
    return `${apiUrl}/uploads/${imagemPerfil}`;
  }, [apiUrl]);

  useEffect(() => {
    if (user && user._id) {
      setNome(user.nome);

      // CORREÇÃO: Usar a função getImagemPerfilUrl para todas as imagens
      setPreviewUrl(getImagemPerfilUrl(user.imagemPerfil));

      const fetchPerfilData = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/perfil/${user._id}`);
          if (response.ok) {
            const perfilData = await response.json();
            setHasPerfilSaved(true);
            setTipoPessoa(perfilData.tipoPessoa);

            const dataNascimentoFormatada = perfilData.dadosPessoais.dataNascimento
              ? new Date(perfilData.dadosPessoais.dataNascimento).toISOString().slice(0, 10)
              : "";

            setDadosPessoais({
              ...perfilData.dadosPessoais,
              dataNascimento: dataNascimentoFormatada,
              cpf: formatCpf(perfilData.dadosPessoais.cpf || ""),
              cnpj: formatCnpj(perfilData.dadosPessoais.cnpj || ""),
              telefone: formatTelefone(perfilData.dadosPessoais.telefone || "")
            });

            setDadosOrganizacao(perfilData.dadosOrganizacao);
            setEditandoDadosAdicionais(false);

            // --- VERIFICAÇÃO DE CONTA DO MERCADO PAGO ---
            if (perfilData.mercadopago_account_id) {
              setMercadopagoConnected(true);
              setMercadopagoAccountId(perfilData.mercadopago_account_id);
            }
          } else {
            setEditandoDadosAdicionais(true);
          }
        } catch (error) {
          console.error("Erro ao buscar dados de perfil:", error);
          setEditandoDadosAdicionais(true);
        }
      };
      fetchPerfilData();
    }
  }, [user, apiUrl, getImagemPerfilUrl]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000); // Fecha após 3 segundos

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleSalvarLogin = async () => {
    if (!user) return;
    
    // VALIDAÇÃO DO NOME ANTES DE SALVAR
    if (!validateNome(nome)) {
      return; // Não prossegue se o nome for inválido
    }

    const formData = new FormData();
    formData.append("nome", nome.trim()); // Remove espaços extras
    if (imagem) formData.append("imagemPerfil", imagem);

    try {
      const response = await fetch(`${apiUrl}/api/users/updateByEmail/${user.email}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Erro ao atualizar perfil: " + errorData.message);
      }

      const data = await response.json();
      updateUser(data.user);
      localStorage.setItem("userName", nome);
      localStorage.setItem("imagemPerfil", data.user.imagemPerfil || "");

      // --- MOSTRAR MODAL DE SUCESSO ---
      setSuccessMessage("Nome e foto de perfil atualizados com sucesso!");
      setShowSuccessModal(true);

      setEditando(false);
      setImagem(null);

    } catch (error) {
      console.error("Erro ao atualizar os dados de login:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao atualizar os dados de login.");
      }
    }
  };

  const handleNomeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const novoNome = e.target.value;
    setNome(novoNome);
    
    // Validação em tempo real (opcional)
    if (editando) {
      validateNome(novoNome);
    }
  };

  const handleSalvarDadosAdicionais = async () => {
    if (!user || !user._id) {
      alert("ID de usuário não encontrado.");
      return;
    }

    const dadosParaSalvar = {
      tipoPessoa,
      dadosPessoais: {
        ...dadosPessoais,
        cpf: dadosPessoais.cpf.replace(/\D/g, ""),
        cnpj: dadosPessoais.cnpj.replace(/\D/g, ""),
        telefone: dadosPessoais.telefone.replace(/\D/g, "")
      },
      dadosOrganizacao: {
        ...dadosOrganizacao,
        cpfSocio: dadosOrganizacao.cpfSocio.replace(/\D/g, ""),
        inscricaoMunicipal: cleanInscricaoMunicipal(dadosOrganizacao.inscricaoMunicipal)
      }
    };

    try {
      const response = await fetch(`${apiUrl}/api/perfil/salvar/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaSalvar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Erro ao salvar dados de perfil: " + errorData.message);
      }

      // --- MOSTRAR MODAL DE SUCESSO ---
      setSuccessMessage("Dados pessoais atualizados com sucesso!");
      setShowSuccessModal(true);

      setEditandoDadosAdicionais(false);

    } catch (error) {
      console.error("Erro ao salvar os dados de perfil:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao salvar os dados de perfil.");
      }
    }
  };

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagem(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- FUNÇÃO PARA CONECTAR O MERCADO PAGO ---
  const handleConnectMercadoPago = async () => {
    if (!user) {
      alert("Usuário não encontrado. Por favor, faça login novamente.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/mercadopago/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.url;
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com Mercado Pago:", error);
      alert("Ocorreu um erro ao iniciar a conexão com o Mercado Pago.");
    }
  };

  if (isLoading) return <div className="perfil-loading">Carregando perfil...</div>;
  if (!user) return <div className="perfil-error">Usuário não encontrado. Por favor, faça login.</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
      </div>

      {/* Seção de Conexão com o Mercado Pago */}
      <div className="perfil-card full-width">
        <div className="perfil-header-secondary">
          <TbPlugConnected className="perfil-tab-icon" />
          <h3>Conexão Mercado Pago</h3>
        </div>
        <div className="perfil-tab-content">
          {mercadopagoConnected ? (
            <div className="perfil-connection-status connected">
              <p>Sua conta do Mercado Pago está conectada!</p>
              <p><strong>ID da Conta:</strong> {mercadopagoAccountId}</p>
            </div>
          ) : (
            <div className="perfil-connection-status disconnected">
              <p>Para vender ingressos e receber pagamentos, conecte sua conta do Mercado Pago.</p>
              <p className="perfil-notice">
                <strong>Atenção:</strong> A emissão de notas fiscais será realizada automaticamente a partir dos dados cadastrados nesta conta.
              </p>
              <button className="perfil-btn-primary" onClick={handleConnectMercadoPago}>
                Conectar ao Mercado Pago
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo em duas colunas */}
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
                  onError={(e) => {
                    // Fallback em caso de erro no carregamento
                    e.currentTarget.src = `${apiUrl}/uploads/blank_profile.png`;
                  }}
                />
                {editando && (
                  <label htmlFor="upload-avatar" className="perfil-avatar-edit">
                    <FiCamera />
                    <input
                      id="upload-avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImagemChange}
                      style={{ display: "none" }}
                    />
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
              {/* MENSAGEM DE ERRO DO NOME */}
              {nomeError && (
                <div className="perfil-error-message">
                  {nomeError}
                </div>
              )}
            </div>

            <div className="perfil-form-group">
              <label className="perfil-input-label">
                <FiMail className="perfil-input-icon" />
                <span>Email</span>
              </label>
              <input
                type="email"
                className="perfil-input"
                disabled
                value={user.email}
              />
            </div>

            <button
              className={`perfil-btn-primary ${editando ? 'perfil-btn-save' : ''}`}
              onClick={() => { 
                if (editando) {
                  handleSalvarLogin(); 
                } else {
                  setEditando(true);
                  setNomeError(""); // Limpa erro ao entrar em modo edição
                }
              }}
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
                      <input
                        type="radio"
                        name="tipoPessoa"
                        value="cpf"
                        checked={tipoPessoa === "cpf"}
                        onChange={() => setTipoPessoa("cpf")}
                        disabled={!editandoDadosAdicionais}
                      />
                      <span>CPF</span>
                    </label>
                    <label className="perfil-radio-pill">
                      <input
                        type="radio"
                        name="tipoPessoa"
                        value="cnpj"
                        checked={tipoPessoa === "cnpj"}
                        onChange={() => setTipoPessoa("cnpj")}
                        disabled={!editandoDadosAdicionais}
                      />
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
                      setDadosPessoais({
                        ...dadosPessoais,
                        [tipoPessoa]: formattedValue
                      });
                    }}
                    disabled={!editandoDadosAdicionais}
                  />
                </div>

                {tipoPessoa === "cpf" && (
                  <>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiCalendar className="perfil-input-icon" />
                        <span>Data de nascimento</span>
                      </label>
                      <input
                        type="date"
                        className="perfil-input"
                        value={dadosPessoais.dataNascimento}
                        onChange={(e) => setDadosPessoais({ ...dadosPessoais, dataNascimento: e.target.value })}
                        disabled={!editandoDadosAdicionais}
                      />
                    </div>
                  </>
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
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, razaoSocial: e.target.value })}
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
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, nomeFantasia: e.target.value })}
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
                        onChange={(e) => {
                          setDadosOrganizacao({ ...dadosOrganizacao, inscricaoMunicipal: e.target.value });
                        }}
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
                          setDadosOrganizacao({ ...dadosOrganizacao, cpfSocio: formattedCpf });
                        }}
                        disabled={!editandoDadosAdicionais}
                      />
                    </div>
                  </>
                )}

                {tipoPessoa === "cnpj" && (
                  <>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiUser className="perfil-input-icon" />
                        <span>Nome completo do Sócio/Representante</span>
                      </label>
                      <input
                        className="perfil-input"
                        value={dadosPessoais.nomeCompleto}
                        onChange={(e) => setDadosPessoais({ ...dadosPessoais, nomeCompleto: e.target.value })}
                        disabled={!editandoDadosAdicionais}
                      />
                    </div>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiCalendar className="perfil-input-icon" />
                        <span>Data de nascimento</span>
                      </label>
                      <input
                        type="date"
                        className="perfil-input"
                        value={dadosPessoais.dataNascimento}
                        onChange={(e) => setDadosPessoais({ ...dadosPessoais, dataNascimento: e.target.value })}
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
                      setDadosPessoais({ ...dadosPessoais, telefone: formattedValue });
                    }}
                    disabled={!editandoDadosAdicionais}
                  />
                </div>
              </div>
            </div>

            <button
              className={`perfil-btn-primary ${editandoDadosAdicionais ? 'perfil-btn-save' : ''}`}
              onClick={() => {
                if (editandoDadosAdicionais) {
                  handleSalvarDadosAdicionais();
                } else {
                  setEditandoDadosAdicionais(true);
                }
              }}
              style={{ marginTop: '20px' }}
            >
              {editandoDadosAdicionais ? <FiCheck /> : <FiEdit2 />}
              {editandoDadosAdicionais ? "Salvar Dados Pessoais" : "Editar Dados Pessoais"}
            </button>
          </div>

          {/* --- MODAL DE SUCESSO --- */}
          {showSuccessModal && (
            <div className="perfil-modal-overlay">
              <div className="perfil-modal">
                <div className="perfil-modal-content">
                  <div className="perfil-modal-icon">
                    <FiCheck />
                  </div>
                  <h3 className="perfil-modal-title">Sucesso!</h3>
                  <p className="perfil-modal-message">{successMessage}</p>
                  <div className="perfil-modal-progress">
                    <div className="perfil-modal-progress-bar"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
