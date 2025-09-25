import React from 'react';
import '../../styles/Termos.css'

function Termos() {
  return (
    <div className="Termos-pagina-termos">
      <div className="Termos-container">
        <h2 className="Termos-titulo-principal">Termos de Uso da Plataforma VibeTicket</h2>
        
        <div className="Termos-introducao">
          <p className="Termos-texto-introducao">
            Bem-vindo à VibeTicket. Ao utilizar nossos serviços, você concorda com estes Termos de Uso.
            Caso não concorde, pedimos que não utilize a plataforma.
          </p>
        </div>

        <hr className="Termos-separador" />

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">1. Uso da Plataforma</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Nossa plataforma permite que usuários criem eventos, comprem ingressos e realizem
              doações para instituições. O usuário é responsável por fornecer informações corretas ao
              se cadastrar e deve utilizar o serviço de forma legal e ética.
            </p>
            <p className="Termos-paragrafo">
              O uso indevido pode levar à suspensão ou remoção da conta.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">2. Responsabilidade dos Organizadores</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Os organizadores são totalmente responsáveis pelos eventos criados, incluindo sua realização, 
              possíveis cancelamentos e reembolsos. A plataforma atua apenas como intermediária
              e não se responsabiliza por problemas nos eventos.
            </p>
            <p className="Termos-paragrafo">
              Empresas que fizerem grandes doações poderão ser destacadas como patrocinadores no site.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">3. Privacidade e Segurança dos Dados</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Para garantir a melhor experiência, armazenamos informações dos usuários em nosso banco
              de dados de forma segura e protegida. Adotamos medidas para garantir a confidencialidade
              e integridade dos dados, seguindo boas práticas de segurança.
            </p>
            <p className="Termos-paragrafo">
              Não compartilhamos informações pessoais sem consentimento, salvo quando exigido por lei.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">4. Modificações dos Termos</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Nos reservamos o direito de modificar estes termos a qualquer momento, e o uso contínuo
              da plataforma após atualizações implica na aceitação das novas condições.
            </p>
            <p className="Termos-paragrafo">
              Para dúvidas ou suporte, entre em contato pelo e-mail <a href="mailto:contato@vibeticket.com" className="Termos-link">
                contato@vibeticket.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Termos;