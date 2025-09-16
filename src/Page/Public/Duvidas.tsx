// Duvidas.tsx (apenas a parte do header atualizada)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiMinus, FiMail, FiHelpCircle } from "react-icons/fi";
import "../../styles/Duvidas.css";
import logo from "../../assets/logo.png";

function Duvidas() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    { 
      category: "Eventos", 
      questions: [
        { question: "Como posso criar um evento?", answer: "Para criar um evento, basta acessar a seção 'Criar Evento' e preencher as informações solicitadas." },
        { question: "Como faço para editar meu evento?", answer: "Você pode editar o evento clicando em 'Editar' na página de detalhes do evento." },
        { question: "Posso cancelar um evento depois de criado?", answer: "Sim, basta acessar a página do evento e selecionar a opção 'Cancelar Evento'." },
        { question: "Como posso adicionar uma imagem ao evento?", answer: "Ao criar ou editar um evento, você pode adicionar uma imagem clicando na opção de upload de imagem." }
      ]
    },
    { 
      category: "Conta e Login", 
      questions: [
        { question: "Como faço para criar uma conta?", answer: "Para criar uma conta, clique no botão 'Cadastrar' na página inicial, preencha os campos necessários (nome, e-mail, senha), e você estará pronto para começar." },
        { question: "Esqueci minha senha, como posso recuperá-la?", answer: "Clique em 'Esqueci minha senha' na tela de login, insira seu e-mail, e enviaremos um link para você redefinir sua senha." },
        { question: "Não consigo acessar minha conta, o que fazer?", answer: "Se você não consegue acessar sua conta, verifique se o e-mail e a senha estão corretos. Caso ainda tenha problemas, tente recuperar sua senha ou entre em contato com nosso suporte." },
        { question: "Como altero meu e-mail ou senha?", answer: "Após fazer login, acesse 'Configurações' e lá você poderá alterar seu e-mail e senha. Lembre-se de salvar as alterações!" },
        { question: "Posso usar meu login do Google/Facebook para acessar?", answer: "Sim, você pode fazer login utilizando sua conta do Google ou Facebook. Basta escolher uma das opções na tela de login." }
      ]
    },
    { 
      category: "Cadastro", 
      questions: [
        { question: "Como faço para desativar minha conta?", answer: "Para desativar sua conta, entre em contato com o suporte ou acesse as configurações da sua conta e solicite a desativação." },
        { question: "Preciso confirmar meu e-mail para finalizar o cadastro?", answer: "Sim, após se cadastrar, você receberá um e-mail de confirmação. Clique no link do e-mail para ativar sua conta." },
        { question: "Como faço para alterar meus dados de cadastro?", answer: "Após o login, acesse a seção de 'Configurações' para alterar seus dados de cadastro, como nome, e-mail e senha." },
        { question: "O que fazer se meu e-mail não for aceito no cadastro?", answer: "Verifique se o e-mail foi digitado corretamente. Caso o erro persista, o e-mail pode já estar registrado ou não seguir o formato correto." },
        { question: "É possível usar a mesma conta em vários dispositivos?", answer: "Sim, você pode acessar sua conta de qualquer dispositivo, basta fazer login com seu e-mail e senha." }
      ]
    }
  ];

  return (
    <div className="duvidas-page">
      <header className="duvidas-header">
        <div className="duvidas-header-content">
          <div className="header-left">
            <Link to="/Home" className="back-button" title="Voltar">
              <img src={logo} alt="Logo" className="duvidas-header-logo" />
            </Link>
            <div className="header-divider"></div>
            <div className="header-title-section">
              <FiHelpCircle className="header-icon" />
              <h1 className="duvidas-header-title">Central de Dúvidas</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="duvidas-main">
        {/* O restante do conteúdo permanece igual */}
        <section className="duvidas-intro">
          <h1>Como podemos ajudar?</h1>
          <p>Encontre respostas para as dúvidas mais comuns ou entre em contato conosco.</p>
        </section>

        <section className="duvidas-faq">
          <h2>Perguntas Frequentes</h2>
          
          {faqItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h3>{category.category}</h3>
              <div className="duvidas-faq-list">
                {category.questions.map((item, index) => {
                  const globalIndex = categoryIndex * 10 + index;
                  return (
                    <div
                      key={globalIndex}
                      className={`duvidas-faq-item ${activeIndex === globalIndex ? "active" : ""}`}
                    >
                      <button
                        className="duvidas-faq-question"
                        onClick={() => toggleQuestion(globalIndex)}
                        aria-expanded={activeIndex === globalIndex}
                      >
                        {item.question}
                        <span className="duvidas-faq-icon">
                          {activeIndex === globalIndex ? <FiMinus /> : <FiPlus />}
                        </span>
                      </button>
                      <div className="duvidas-faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="duvidas-contact">
          <div className="contact-content">
            <div className="contact-icon">
              <FiMail size={48} />
            </div>
            <h2>Não encontrou o que procurava?</h2>
            <p>Nossa equipe de suporte está pronta para ajudar você</p>
            <div className="contact-actions">
              <a href="bruno.nunes.5056.br@gmail.com" className="duvidas-contact-button">
                <FiMail size={18} />
                Enviar e-mail
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Duvidas;