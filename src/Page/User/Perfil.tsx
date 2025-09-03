import React, { useState, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck, FiUser, FiShoppingBag, FiCalendar, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { useAuth } from "../../Hook/AuthContext";
import "../../styles/Perfil.css";

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();

  const [editando, setEditando] = useState(false);
  const [editandoDadosAdicionais, setEditandoDadosAdicionais] = useState(false); // Novo estado
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");

  const [_hasPerfilSaved, setHasPerfilSaved] = useState(false);

  const [tipoPessoa, setTipoPessoa] = useState<"cpf" | "cnpj">("cpf");
  const docLabel = tipoPessoa === "cpf" ? "CPF" : "CNPJ";
  const docPlaceholder = tipoPessoa === "cpf" ? "000.000.000-00" : "00.000.000/0000-00";
  const docMaxLength = tipoPessoa === "cpf" ? 14 : 18;

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

  const getImagemPerfilUrl = (imagemPerfil?: string) => {
    if (!imagemPerfil) return `${apiUrl}/uploads/blank_profile.png`;
    if (imagemPerfil.startsWith('http')) {
      return imagemPerfil;
    }
    if (imagemPerfil.startsWith('/uploads')) {
      return `${apiUrl}${imagemPerfil}`;
    }
    return `${apiUrl}/uploads/${imagemPerfil}`;
  };

  useEffect(() => {
    if (user && user._id) {
      setNome(user.nome);
      if (user.imagemPerfil?.startsWith('http')) {
        setPreviewUrl(user.imagemPerfil);
      } else {
        setPreviewUrl(user.imagemPerfil ? `${apiUrl}${user.imagemPerfil}` : undefined);
      }

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
              cnpj: formatCnpj(perfilData.dadosPessoais.cnpj || "")
            });

            setDadosOrganizacao(perfilData.dadosOrganizacao);
            setEditandoDadosAdicionais(false); // Inicia com o modo de edição desabilitado
          } else {
            // Se não houver dados, o modo de edição fica ativado para o primeiro cadastro
            setEditandoDadosAdicionais(true);
          }
        } catch (error) {
          console.error("Erro ao buscar dados de perfil:", error);
          setEditandoDadosAdicionais(true); // Se houver erro, permite a edição
        }
      };
      fetchPerfilData();
    }
  }, [user, setPreviewUrl, apiUrl]);

  const handleSalvarLogin = async () => {
    if (!user) return;
    const formData = new FormData();
    formData.append("nome", nome);
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

      alert("Nome e foto de perfil atualizados com sucesso!");
      setEditando(false);
      setImagem(null);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar os dados de login:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Ocorreu um erro desconhecido ao atualizar os dados de login.");
      }
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
        cnpj: dadosPessoais.cnpj.replace(/\D/g, "")
      },
      dadosOrganizacao
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

      alert("Dados pessoais atualizados com sucesso!");
      setEditandoDadosAdicionais(false); // Desabilita a edição após salvar
      window.location.reload();
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

  if (isLoading) return <div className="perfil-loading">Carregando perfil...</div>;
  if (!user) return <div className="perfil-error">Usuário não encontrado. Por favor, faça login.</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <p>Gerencie suas informações pessoais</p>
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
                className="perfil-input"
                disabled={!editando}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
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
              onClick={() => { if (editando) handleSalvarLogin(); else setEditando(true); }}
            >
              {editando ? <FiCheck /> : <FiEdit2 />}
              {editando ? "Salvar login" : "Editar perfil"}
            </button>
          </div>
        </div>

        <div className="perfil-right">
          <div className="perfil-card">
            <div className="perfil-header-secondary">
              <FiShoppingBag className="perfil-tab-icon" />
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
                        disabled={!editandoDadosAdicionais} // Bloqueia a troca de tipo
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
                        disabled={!editandoDadosAdicionais} // Bloqueia a troca de tipo
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
                    disabled={!editandoDadosAdicionais} // Bloqueia o campo
                  />
                </div>

                {tipoPessoa === "cnpj" && (
                  <>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiUser className="perfil-input-icon" />
                        <span>Razão Social</span>
                      </label>
                      <input
                        className="perfil-input"
                        value={dadosOrganizacao.razaoSocial}
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, razaoSocial: e.target.value })}
                        disabled={!editandoDadosAdicionais} // Bloqueia o campo
                      />
                    </div>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiUser className="perfil-input-icon" />
                        <span>Nome Fantasia</span>
                      </label>
                      <input
                        className="perfil-input"
                        value={dadosOrganizacao.nomeFantasia}
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, nomeFantasia: e.target.value })}
                        disabled={!editandoDadosAdicionais} // Bloqueia o campo
                      />
                    </div>
                    <div className="perfil-form-group">
                      <label className="perfil-input-label">
                        <FiUser className="perfil-input-icon" />
                        <span>Inscrição Municipal</span>
                      </label>
                      <input
                        className="perfil-input"
                        value={dadosOrganizacao.inscricaoMunicipal}
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, inscricaoMunicipal: e.target.value })}
                        disabled={!editandoDadosAdicionais} // Bloqueia o campo
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
                        onChange={(e) => setDadosOrganizacao({ ...dadosOrganizacao, cpfSocio: e.target.value })}
                        disabled={!editandoDadosAdicionais} // Bloqueia o campo
                      />
                    </div>
                  </>
                )}
                <div className="perfil-form-group">
                  <label className="perfil-input-label">
                    <FiUser className="perfil-input-icon" />
                    <span>Nome Completo</span>
                  </label>
                  <input
                    className="perfil-input"
                    value={dadosPessoais.nomeCompleto}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, nomeCompleto: e.target.value })}
                    disabled={!editandoDadosAdicionais} // Bloqueia o campo
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
                    disabled={!editandoDadosAdicionais} // Bloqueia o campo
                  />
                </div>
                <div className="perfil-form-group">
                  <label className="perfil-input-label">
                    <FiPhone className="perfil-input-icon" />
                    <span>Telefone</span>
                  </label>
                  <input
                    className="perfil-input"
                    value={dadosPessoais.telefone}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })}
                    disabled={!editandoDadosAdicionais} // Bloqueia o campo
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
        </div>
      </div>
    </div>
  );
};

export default Perfil;