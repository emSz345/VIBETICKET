import React, { useState, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck, FiUser, FiShoppingBag, FiCalendar, FiPhone, FiMail, FiCamera } from "react-icons/fi";
import { useAuth } from "../../Hook/AuthContext";
import "../../styles/Perfil.css";

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");

  // Alterna entre CPF e CNPJ
  const [tipoPessoa, setTipoPessoa] = useState<"cpf" | "cnpj">("cpf");
  const docLabel = tipoPessoa === "cpf" ? "CPF" : "CNPJ";
  const docPlaceholder = tipoPessoa === "cpf" ? "000.000.000-00" : "00.000.000/0000-00";
  const docMaxLength = tipoPessoa === "cpf" ? 14 : 18;

  const [dadosPessoais, setDadosPessoais] = useState({
    cpfCnpj: "",
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

  // Limpa campos específicos ao alternar tipo de documento
  useEffect(() => {
    if (tipoPessoa === "cpf") {
      setDadosOrganizacao({
        razaoSocial: "",
        nomeFantasia: "",
        inscricaoMunicipal: "",
        cpfSocio: ""
      });
    }
  }, [tipoPessoa]);

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
    if (user) {
      setNome(user.nome);

      if (user.imagemPerfil?.startsWith('http')) {
        setPreviewUrl(user.imagemPerfil);
      } else {
        setPreviewUrl(user.imagemPerfil ? `${apiUrl}${user.imagemPerfil}` : undefined);
      }
    }
  }, [user, setPreviewUrl, apiUrl]);

  const handleSalvarAlteracoes = async () => {
    if (!user) return;
    const formData = new FormData();

    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(nome)) {
      alert("Nome deve conter pelo menos 10 letras e nenhum número.");
      return;
    }

    formData.append("nome", nome);
    if (imagem) formData.append("imagemPerfil", imagem);

    try {
      const response = await fetch(`${apiUrl}/api/users/updateByEmail/${user.email}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        updateUser(data.user);
        localStorage.setItem("userName", nome);
        localStorage.setItem("imagemPerfil", data.user.imagemPerfil || "");
        localStorage.setItem("hasLocalImage", "true");
        setEditando(false);
        setImagem(null);
        window.location.reload();
      } else {
        alert("Erro ao atualizar perfil: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro na comunicação com o servidor.");
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
        {/* Coluna Esquerda - Dados Pessoais */}
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
              onClick={() => { if (editando) handleSalvarAlteracoes(); else setEditando(true); }}
            >
              {editando ? <FiCheck /> : <FiEdit2 />}
              {editando ? "Salvar alterações" : "Editar perfil"}
            </button>
          </div>
        </div>

        {/* Coluna Direita - Dados do Organizador */}
        <div className="perfil-right">
          <div className="perfil-card">
            <div className="perfil-header-secondary">
              <FiShoppingBag className="perfil-tab-icon" />
              <h3>Dados do Pessoais</h3>
            </div>

            <div className="perfil-tab-content">
              <div className="perfil-form-grid">
                {/* Toggle CPF/CNPJ */}
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
                      />
                      <span>CNPJ</span>
                    </label>
                  </div>
                </div>

                {/* CPF / CNPJ */}
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
                    value={dadosPessoais.cpfCnpj}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cpfCnpj: e.target.value })}
                  />
                </div>

                {/* Campos específicos para CNPJ */}
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
                      />
                    </div>
                  </>
                )}
                {/* Campos comuns para CPF e CNPJ */}
                {tipoPessoa === "cnpj" && (
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Nome Completo</span>
                    </label>
                    <input
                      className="perfil-input"
                      value={dadosPessoais.nomeCompleto}
                      onChange={(e) => setDadosPessoais({ ...dadosPessoais, nomeCompleto: e.target.value })}
                    />
                  </div>
                )}

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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;