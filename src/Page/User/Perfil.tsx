import React, { useState, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck } from "react-icons/fi";

import "../../styles/Perfil.css";

interface PerfilProps {
  nomeUsuario: string;
  emailUsuario: string;
  tipoLogin: "email" | "google" | "facebook";
  avatarUrl?: string;
}

const Perfil: React.FC<PerfilProps> = ({ nomeUsuario, emailUsuario, tipoLogin, avatarUrl }) => {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(nomeUsuario);
  const [email, setEmail] = useState(emailUsuario);
  const [senha, setSenha] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(avatarUrl);
  

  const isSocialLogin = tipoLogin === "google" || tipoLogin === "facebook";

   useEffect(() => {
    // Quando o componente monta, buscar a imagem salva no localStorage
    const imagemPerfilSalva = localStorage.getItem("imagemPerfil");

    if (imagemPerfilSalva) {
      setPreviewUrl(`http://localhost:5000/uploads/${imagemPerfilSalva}`);
    } else if (avatarUrl) {
      setPreviewUrl(avatarUrl);
    }
  }, []);
    
  

  const handleSalvar = async () => {
    try {
      const emailParaImagem = localStorage.getItem("email");
      
      const response = await fetch(`http://localhost:5000/api/users/updateByEmail/${emailParaImagem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          ...(senha && { senha }), 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Dados atualizados com sucesso!");
        localStorage.setItem("userName",nome)
        localStorage.setItem("email",email)
        
        setEditando(false);
      } else {
        alert("Erro ao atualizar dados: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alterações.");
    }
  };

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSalvarImagem = async () => {
    if (!imagem) return;

    const formData = new FormData();
    formData.append("imagemPerfil", imagem);

    try {
      const userId = localStorage.getItem("email");

      const response = await fetch(`http://localhost:5000/api/users/updateByEmail/${userId}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Imagem atualizada com sucesso!");
        
        if (data.user.imagemPerfil) {
          setPreviewUrl(`http://localhost:5000/uploads/${data.user.imagemPerfil}`);
          localStorage.setItem("imagemPerfil",data.user.imagemPerfil);
        }
      } else {
        alert("Erro ao atualizar imagem: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagem.");
    }
  };

  return (
    <div className="perfil-scroll-container">
      <div className="perfil-content">
        <h2>Meu Perfil</h2>

        <div className="perfil-avatar-section">
          <img
            src={ previewUrl }
            
            className="perfil-avatar"
          />
          {!isSocialLogin && (
            <>
              <label htmlFor="upload-avatar" className="perfil-btn-alterar-foto">Alterar Foto</label>
              <input
                id="upload-avatar"
                type="file"
                accept="image/*"
                onChange={handleImagemChange}
                style={{ display: "none" }}
              />
              {imagem && <button className="perfil-btn-salvar-foto" onClick={handleSalvarImagem}>Salvar Foto</button>}
            </>
          )}
        </div>

        <div className="perfil-campo-edicao">
          <label>Nome:</label>
          <input
            type="text"
            disabled={!editando || isSocialLogin}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="perfil-campo-edicao">
          <label>Email:</label>
          <input
            type="email"
            disabled={!editando || isSocialLogin}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="perfil-campo-edicao">
          <label>Senha:</label>
          <input
            type="password"
            disabled={!editando || isSocialLogin}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {!isSocialLogin && (
          <button
            className="perfil-btn-editar"
            onClick={() => {
              if (editando) handleSalvar();
              else setEditando(true);
            }}
          >
            {editando ? <FiCheck /> : <FiEdit2 />} {editando ? "Salvar" : "Editar"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Perfil;