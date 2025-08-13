import React, { useState, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck, FiUser, FiShoppingBag, FiCalendar, FiPhone, FiMapPin, FiMail, FiCamera } from "react-icons/fi";
import { useAuth } from "../../Hook/AuthContext";
import "../../styles/Perfil.css";

const Perfil = () => {
  const { user, isLoading, updateUser } = useAuth();

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");

  const [abaAtiva, setAbaAtiva] = useState<"comprador" | "organizador">("comprador");

  const [comprador, setComprador] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    endereco: ""
  });

  const [organizador, setOrganizador] = useState({
    cnpjCpf: "",
    razaoSocial: "",
    nomeFantasia: "",
    inscricaoMunicipal: "",
    cpfSocio: "",
    nomeCompleto: "",
    dataNascimento: "",
    telefone: "",
    endereco: ""
  });

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setPreviewUrl(user.imagemPerfil ? `http://localhost:5000/uploads/${user.imagemPerfil}` : undefined);
    }
  }, [user]);

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
      const response = await fetch(`http://localhost:5000/api/users/updateByEmail/${user.email}`, {
        method: "PUT",
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        updateUser(data.user);
        localStorage.setItem("userName", nome);
        localStorage.setItem("imagemPerfil", data.user.imagemPerfil || "");
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
                  src={previewUrl || "https://via.placeholder.com/150"} 
                  alt="Foto de perfil" 
                  className="perfil-avatar" 
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

        {/* Coluna Direita - Abas */}
        <div className="perfil-right">
          <div className="perfil-card">
            <div className="perfil-tabs">
              <button 
                className={`perfil-tab ${abaAtiva === "comprador" ? "active" : ""}`}
                onClick={() => setAbaAtiva("comprador")}
              >
                <FiUser className="perfil-tab-icon" />
                Dados do Comprador
              </button>
              <button 
                className={`perfil-tab ${abaAtiva === "organizador" ? "active" : ""}`}
                onClick={() => setAbaAtiva("organizador")}
              >
                <FiShoppingBag className="perfil-tab-icon" />
                Dados do Organizador
              </button>
            </div>

            <div className="perfil-tab-content">
              {abaAtiva === "comprador" && (
                <div className="perfil-form-grid">
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Nome</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={comprador.nome} 
                      onChange={(e) => setComprador({ ...comprador, nome: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>CPF</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={comprador.cpf} 
                      onChange={(e) => setComprador({ ...comprador, cpf: e.target.value })} 
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
                      value={comprador.dataNascimento} 
                      onChange={(e) => setComprador({ ...comprador, dataNascimento: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiPhone className="perfil-input-icon" />
                      <span>Telefone</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={comprador.telefone} 
                      onChange={(e) => setComprador({ ...comprador, telefone: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group full-width">
                    <label className="perfil-input-label">
                      <FiMapPin className="perfil-input-icon" />
                      <span>Endereço</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={comprador.endereco} 
                      onChange={(e) => setComprador({ ...comprador, endereco: e.target.value })} 
                    />
                  </div>
                </div>
              )}

              {abaAtiva === "organizador" && (
                <div className="perfil-form-grid">
                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>CNPJ/CPF</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.cnpjCpf} 
                      onChange={(e) => setOrganizador({ ...organizador, cnpjCpf: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Razão Social</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.razaoSocial} 
                      onChange={(e) => setOrganizador({ ...organizador, razaoSocial: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Nome Fantasia</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.nomeFantasia} 
                      onChange={(e) => setOrganizador({ ...organizador, nomeFantasia: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Inscrição Municipal</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.inscricaoMunicipal} 
                      onChange={(e) => setOrganizador({ ...organizador, inscricaoMunicipal: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>CPF do Sócio/Representante</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.cpfSocio} 
                      onChange={(e) => setOrganizador({ ...organizador, cpfSocio: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiUser className="perfil-input-icon" />
                      <span>Nome Completo</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.nomeCompleto} 
                      onChange={(e) => setOrganizador({ ...organizador, nomeCompleto: e.target.value })} 
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
                      value={organizador.dataNascimento} 
                      onChange={(e) => setOrganizador({ ...organizador, dataNascimento: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group">
                    <label className="perfil-input-label">
                      <FiPhone className="perfil-input-icon" />
                      <span>Telefone</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.telefone} 
                      onChange={(e) => setOrganizador({ ...organizador, telefone: e.target.value })} 
                    />
                  </div>

                  <div className="perfil-form-group full-width">
                    <label className="perfil-input-label">
                      <FiMapPin className="perfil-input-icon" />
                      <span>Endereço</span>
                    </label>
                    <input 
                      className="perfil-input"
                      value={organizador.endereco} 
                      onChange={(e) => setOrganizador({ ...organizador, endereco: e.target.value })} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;