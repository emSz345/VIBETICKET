import React from 'react';
import '../../styles/Termos2.css'

function Termos() {
  return (
    <div className="pagina-termos">
      <div className="termos-container">
        <h2>Termos de Uso</h2>
        <div className="termos-introducao">
          <p>
            Bem-vindo à NaVibe. Ao utilizar nossos serviços, você concorda com estes Termos de Uso.
            Caso não concorde, pedimos que não utilize a plataforma.
          </p>
        </div>

        <hr className="termos-separador" />

        <div className="termos-secao">
          <h3>1. Uso da Plataforma</h3>
          <div className="termos-texto">
            <p>
              - Nossa plataforma permite que usuários criem eventos, comprem ingressos e realizem
              doações para instituições. O usuário é responsável por fornecer informações corretas ao
              se cadastrar e deve utilizar o serviço de forma legal e ética. O uso indevido pode levar à
              suspensão ou remoção da conta.
            </p>
          </div>
        </div>

        <div className="termos-secao">
          <h3>2. Responsabilidade dos Organizadores</h3>
          <div className="termos-texto">
            <p>
              - Os organizadores são totalmente responsáveis pelos eventos criados, incluindo sua reali-
              zação, possíveis cancelamentos e reembolsos. A plataforma atua apenas como intermediária
              e não se responsabiliza por problemas nos eventos. Empresas que fizerem grandes doações
              poderão ser destacadas como patrocinadores no site.
            </p>
          </div>
        </div>

        <div className="termos-secao">
          <h3>3. Privacidade e Segurança dos Dados</h3>
          <div className="termos-texto">
            <p>
              - Para garantir a melhor experiência, armazenamos informações dos usuários em nosso banco
              de dados de forma segura e protegida. Adotamos medidas para garantir a confidencialidade
              e integridade dos dados, seguindo boas práticas de segurança. Não compartilhamos inform-
              ações pessoais sem consentimento, salvo quando exigido por lei.
            </p>
          </div>
        </div>

        <div className="termos-secao">
          <h3>4. Modificações dos Termos</h3>
          <div className="termos-texto">
            <p>
              - Nos reservamos o direito de modificar estes termos a qualquer momento, e o uso contínuo
              da plataforma após atualizações implica na aceitação das novas condições. Para dúvidas
              ou suporte, entre em contato pelo e-mail <a href="mailto:[e-mail de contato]">
                [e-mail de contato]
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Termos;