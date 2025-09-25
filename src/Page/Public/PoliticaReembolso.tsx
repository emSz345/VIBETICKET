import React from 'react';
import Rodape from '../../components/layout/Footer/Footer';
import '../../styles/PoliticaReembolso.css';

interface PoliticaReembolsoProps { }

const PoliticaReembolso: React.FC<PoliticaReembolsoProps> = () => {
  const emailSuporte = "felipezica7000@gmail.com";
  const enderecoDevolucao = "Av. Dr. Flávio Henrique, Av. Dr. Flávio Henrique Lemos, 585 - Portal Itamaracá, Taquaritinga - SP, 15900-000";

  return (
    <>
      <div className="PoliticaReembolso-container">
        <div className="PoliticaReembolso-content">
          
          <p className="PoliticaReembolso-data-validade">
            Esta política de reembolso é válida a partir de <strong>setembro 2025</strong>.
          </p>

          <h1 className="PoliticaReembolso-titulo-principal">
            POLÍTICA DE REEMBOLSO — VibeTicket
          </h1>

          {/* Introdução */}
          <div className="PoliticaReembolso-secao">
            <p>
              Esta política estabelece as condições para reembolsos relacionados a ingressos adquiridos 
              através da plataforma VibeTicket. Ao realizar uma compra, você concorda com os termos aqui descritos.
            </p>
          </div>

          {/* --- Seção de Cancelamento de Eventos --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Cancelamento de Eventos</h2>
            <p>
              Caso um evento seja <strong>cancelado</strong> pelos organizadores, os reembolsos serão 
              processados <strong>automaticamente</strong> em até <strong>30 dias corridos</strong>. 
              O valor será devolvido utilizando o mesmo método de pagamento original.
            </p>
          </div>

          {/* --- Seção de Remarcação/Adiamento --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Eventos Remarcados ou Adiados</h2>
            <p>
              Se um evento for <strong>remarcado ou adiado</strong>, o ingresso permanecerá válido para a nova data. 
              Caso você não possa comparecer na nova data, terá um prazo de <strong>7 dias</strong> para solicitar 
              o reembolso através do e-mail <a href={`mailto:${emailSuporte}`}>{emailSuporte}</a>.
            </p>
          </div>

          {/* --- Seção de Arrependimento --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Direito de Arrependimento</h2>
            <p>
              Você pode solicitar o reembolso por arrependimento em até <strong>7 dias</strong> após a compra, 
              desde que o evento ocorra em data posterior a este período.
            </p>
            <p>
              Para solicitar, envie um e-mail para <a href={`mailto:${emailSuporte}`}>{emailSuporte}</a> 
              informando <strong>nome completo</strong>, <strong>número do pedido</strong> e <strong>motivo da solicitação</strong>.
            </p>
          </div>

          {/* --- Seção de Não Comparecimento --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Não Comparecimento</h2>
            <p>
              O <strong>não comparecimento</strong> ao evento não dá direito a reembolso, exceto nas situções 
              previstas nesta política (cancelamento, remarcação ou arrependimento dentro do prazo legal).
            </p>
          </div>

          {/* --- Seção de Problemas com o Ingresso --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Problemas com o Ingresso</h2>
            <p>
              Caso ocorram <strong>problemas técnicos</strong> que impeçam a utilização do ingresso no evento 
              (ex: erro de validação, duplicidade), entre em contato imediatamente com o suporte no local do evento 
              ou via <a href={`mailto:${emailSuporte}`}>{emailSuporte}</a> para resolução.
            </p>
          </div>

          {/* --- Seção de Prazos --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Prazos de Reembolso</h2>
            <ul className="PoliticaReembolso-lista">
              <li><strong>Cancelamento do evento:</strong> até 30 dias corridos</li>
              <li><strong>Arrependimento:</strong> até 7 dias após a compra</li>
              <li><strong>Evento remarcado:</strong> 7 dias após o anúncio da nova data</li>
            </ul>
          </div>

          {/* --- Seção de Contato --- */}
          <div className="PoliticaReembolso-secao">
            <h2 className="PoliticaReembolso-subtitulo">Contato</h2>
            <p>
              Para dúvidas ou solicitações de reembolso, entre em contato pelo e-mail {' '}
              <a href={`mailto:${emailSuporte}`} className="PoliticaReembolso-link">{emailSuporte}</a>.
            </p>
            <p className="PoliticaReembolso-observacao">
              <strong>Observação:</strong> Esta política está sujeita a alterações. Consulte sempre a versão mais recente em nosso site.
            </p>
          </div>

        </div>
      </div>
      <Rodape />
    </>
  );
};

export default PoliticaReembolso;