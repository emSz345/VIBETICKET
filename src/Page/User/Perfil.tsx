import React, { useState, ChangeEvent } from "react";
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

  const handleSalvar = () => {
    setEditando(false);
    alert("Salvar alterações (nome/email/senha)");
  };

  const handleImagemChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagem(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSalvarImagem = () => {
    if (!imagem) return;
    alert("Implementar envio da imagem ao backend");
  };

  return (
    <div className="perfil-scroll-container">
      <div className="perfil-content">
        <h2>Meu Perfil</h2>

        <div className="perfil-avatar-section">
          <img
            src={previewUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
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