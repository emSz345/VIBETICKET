// Page/User/Perfil.tsx

import React, { useState, ChangeEvent, useEffect } from "react";
import { FiEdit2, FiCheck } from "react-icons/fi";
import { useAuth } from "../../Hook/AuthContext"; // Importa o hook de autenticação
import "../../styles/Perfil.css";

const Perfil = () => {
  // 1. DADOS VÊM DO CONTEXTO, NÃO DE PROPS
  const { user, isLoading, updateUser } = useAuth();

  // 2. Estados locais para controlar o formulário
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>("");

  // 3. Popula o formulário com os dados do usuário quando o componente carrega
  useEffect(() => {
    if (user) {
      setNome(user.nome);
      // Constrói a URL completa da imagem de perfil
      setPreviewUrl(user.imagemPerfil ? `http://localhost:5000/uploads/${user.imagemPerfil}` : undefined);
    }
  }, [user]); // Roda sempre que o objeto 'user' do contexto mudar

  // Função ÚNICA para salvar TODAS as alterações (dados e imagem)
  const handleSalvarAlteracoes = async () => {
    if (!user) return;

    // Usamos FormData porque estamos enviando um arquivo (imagem)
    const formData = new FormData();

    if (!/^[a-zA-ZÀ-ÿ\s]{10,}$/.test(nome)) {
      alert("Nome deve conter pelo menos 10 letras e nenhum número.")
      return;
    }

    formData.append("nome", nome);

    // Só adiciona a senha ao formulário se o usuário digitou uma nova
    if (senha) {
      formData.append("senha", senha);
    }

    // Só adiciona a imagem se o usuário selecionou uma nova
    if (imagem) {
      formData.append("imagemPerfil", imagem);

    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/updateByEmail/${user.email}`, {
        method: "PUT",
        // Com FormData, o navegador define o 'Content-Type' correto automaticamente
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        // ATUALIZA O ESTADO GLOBAL! A Navbar e outros componentes vão mudar instantaneamente.
        updateUser(data.user);
        localStorage.setItem("userName", nome);
        //atualizado []
        localStorage.setItem("imagemPerfil", data.user.imagemPerfil || "")
        setEditando(false);
        setSenha(""); // Limpa o campo de senha
        setImagem(null); // Limpa a seleção de imagem
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
      setPreviewUrl(URL.createObjectURL(file)); // Gera uma preview local da nova imagem
    }
  };

  // Enquanto o contexto carrega os dados, mostramos uma mensagem
  if (isLoading) {
    return <div>Carregando perfil...</div>;
  }

  // Se por algum motivo não houver usuário logado
  if (!user) {
    return <div>Usuário não encontrado. Por favor, faça login.</div>;
  }

  return (
    <div className="perfil-scroll-container">
      <div className="perfil-content">
        <h2>Meu Perfil</h2>

        <div className="perfil-avatar-section">
          <img src={previewUrl} alt="Foto de perfil" className="perfil-avatar" />
          {/* O botão de alterar foto só aparece se o modo de edição estiver ativo */}
          {editando && (
            <>
              <label htmlFor="upload-avatar" className="perfil-btn-alterar-foto">
                Escolher Nova Foto
              </label>
              <input id="upload-avatar" type="file" accept="image/*" onChange={handleImagemChange} style={{ display: "none" }} />
            </>
          )}
        </div>

        <div className="perfil-campo-edicao">
          <label>Nome:</label>
          <input type="text" disabled={!editando} value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="perfil-campo-edicao">
          <label>Email:</label>
          {/* O email não pode ser editado */}
          <input type="email" disabled value={user.email} />
        </div>

        <div className="perfil-campo-edicao">
          <label>Nova Senha:</label>
          <input type="password" disabled={!editando} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Deixe em branco para não alterar" />
        </div>

        <button
          className="perfil-btn-editar"
          onClick={() => {
            if (editando) {
              handleSalvarAlteracoes();
            } else {
              setEditando(true);
            }
          }}
        >
          {editando ? <FiCheck /> : <FiEdit2 />} {editando ? "Salvar Alterações" : "Editar Perfil"}
        </button>
      </div>
    </div>
  );
};

export default Perfil;