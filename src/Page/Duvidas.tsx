import { Link } from "react-router-dom";
import "../styles/Duvidas.css";
import logo from "../assets/img-logo.png";

function Duvidas() {
  return (
    <div className="duvidas-pagina-termos">
      <header className="duvidas-header">
        <div className="duvidas-header-conteudo">
          <Link to="/Home" title="Voltar">
            <img src={logo} alt="Logo" className="duvidas-header-logo" />
          </Link>
          <hr className="duvidas-hr" />
          <h3 className="duvidas-title">Dúvidas e Suporte</h3>
        </div>
      </header>
      <div className="duvidas-main">
        {/* Container para o título e subtítulo */}
        <section className="duvidas-container-subtitulo">
          <h2>Caso tenha uma dúvida básica, leia as perguntas frequentes abaixo.</h2>
          <p>
            Se não resolver seu problema, envie um e-mail para{" "}
            <strong>suport@b4y.com.br</strong> com as seguintes informações:
            <br />
            <strong>Assunto:</strong> Descrição breve do assunto
            <br />
            <strong>Descrição:</strong> Detalhe o problema e anexe imagens, se possível.
          </p>
        </section>

        {/* Container para as perguntas frequentes */}
        <section className="duvidas-container faq-container">
          <h3>Perguntas Frequentes</h3>
          <ul className="duvidas-faq-list">
            <li style={{ marginBottom: '20' }}>
              <strong>Como posso criar um evento?</strong>
              <p>Para criar um evento, basta acessar a seção "Criar Evento" e preencher as informações solicitadas.</p>
            </li>
            <li>
              <strong>Como faço para editar meu evento?</strong>
              <p>Você pode editar o evento clicando em "Editar" na página de detalhes do evento.</p>
            </li>
            <li>
              <strong>Posso cancelar um evento depois de criado?</strong>
              <p>Sim, basta acessar a página do evento e selecionar a opção "Cancelar Evento".</p>
            </li>
            <li>
              <strong>Como posso adicionar uma imagem ao evento?</strong>
              <p>Ao criar ou editar um evento, você pode adicionar uma imagem clicando na opção de upload de imagem.</p>
            </li>
            <li>
              <strong>Como faço para criar uma conta?</strong>
              <p>Para criar uma conta, clique no botão "Cadastrar" na página inicial, preencha os campos necessários (nome, e-mail, senha), e você estará pronto para começar.</p>
            </li>
            <li>
              <strong>Esqueci minha senha, como posso recuperá-la?</strong>
              <p>Clique em "Esqueci minha senha" na tela de login, insira seu e-mail, e enviaremos um link para você redefinir sua senha.</p>
            </li>
            <li>
              <strong>Não consigo acessar minha conta, o que fazer?</strong>
              <p>Se você não consegue acessar sua conta, verifique se o e-mail e a senha estão corretos. Caso ainda tenha problemas, tente recuperar sua senha ou entre em contato com nosso suporte.</p>
            </li>
            <li>
              <strong>Como altero meu e-mail ou senha?</strong>
              <p>Após fazer login, acesse "Configurações" e lá você poderá alterar seu e-mail e senha. Lembre-se de salvar as alterações!</p>
            </li>
            <li>
              <strong>Posso usar meu login do Google/Facebook para acessar?</strong>
              <p>Sim, você pode fazer login utilizando sua conta do Google ou Facebook. Basta escolher uma das opções na tela de login.</p>
            </li>
            <li>
              <strong>Como faço para desativar minha conta?</strong>
              <p>Para desativar sua conta, entre em contato com o suporte ou acesse as configurações da sua conta e solicite a desativação.</p>
            </li>
            <li>
              <strong>Preciso confirmar meu e-mail para finalizar o cadastro?</strong>
              <p>Sim, após se cadastrar, você receberá um e-mail de confirmação. Clique no link do e-mail para ativar sua conta.</p>
            </li>
            <li>
              <strong>Como faço para alterar meus dados de cadastro?</strong>
              <p>Após o login, acesse a seção de "Configurações" para alterar seus dados de cadastro, como nome, e-mail e senha.</p>
            </li>
            <li>
              <strong>O que fazer se meu e-mail não for aceito no cadastro?</strong>
              <p>Verifique se o e-mail foi digitado corretamente. Caso o erro persista, o e-mail pode já estar registrado ou não seguir o formato correto.</p>
            </li>
            <li>
              <strong>É possível usar a mesma conta em vários dispositivos?</strong>
              <p>Sim, você pode acessar sua conta de qualquer dispositivo, basta fazer login com seu e-mail e senha.</p>
            </li>
          </ul>
        </section>

        {/* Container para o formulário de suporte */}
        <section className="duvidas-container form-suporte">
          <h3>Não encontrou a resposta? Entre em contato com o suporte.</h3>
          <div className="duvidas-campo">
            <label htmlFor="assunto">Assunto</label>
            <input type="text" id="assunto" placeholder="Informe o assunto" />
          </div>
          <div className="duvidas-campo">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              placeholder="Detalhe o seu problema aqui"
            />
          </div>
          <button className="duvidas-btn-enviar-suporte">Enviar</button>
        </section>

        {/* Sucesso enviado */}
        <div className="duvidas-sucesso-enviado">
          Seu e-mail foi enviado com sucesso! Entraremos em contato em breve.
        </div>
      </div>
    </div>
  );
}

export default Duvidas;