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
          <h3 className="Termos-titulo-secao">1. Aceitação dos Termos</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Estes Termos de Uso regulam a relação entre a plataforma VibeTicket, seus usuários ("Você"), 
              sejam Organizadores ou Compradores. Ao se cadastrar ou utilizar nossos serviços, você declara 
              ter lido, compreendido e aceitado integralmente todas as condições aqui estabelecidas.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">2. Cadastro e Conta</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              O cadastro é pessoal e intransferível. Você é o único responsável pela segurança de sua senha 
              e por toda e qualquer atividade que ocorra em sua conta. É obrigatório fornecer informações 
              verídicas, completas e atualizadas.
            </p>
            <p className="Termos-paragrafo">
              A VibeTicket se reserva o direito de recusar, suspender ou cancelar contas que violem estes Termos.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">3. Serviços da Plataforma</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              A VibeTicket atua como uma intermediária tecnológica, disponibilizando um ambiente para que 
              Organizadores criem e promovam eventos e Compradores adquiram ingressos e realizem doações.
            </p>
            <p className="Termos-paragrafo">
              A plataforma <strong>não é</strong> a organizadora dos eventos, nem se responsabiliza por sua 
              execução, qualidade ou segurança.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">4. Responsabilidades dos Organizadores</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              O Organizador é integral e exclusivamente responsável por:
            </p>
            <ul className="Termos-paragrafo">
              <li>Todas as informações divulgadas sobre o evento (data, local, atrativos, restrições)</li>
              <li>O cumprimento de todas as obrigações legais relacionadas ao evento</li>
              <li>A prestação de contas claras sobre as doações recebidas</li>
              <li>Estabelecer e cumprir política de reembolso em caso de cancelamento ou adiamento</li>
              <li>Assegurar que o evento não infrinja direitos de terceiros</li>
            </ul>
            <p className="Termos-paragrafo">
              Empresas que fizerem grandes doações poderão ser destacadas como patrocinadores no site.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">5. Pagamentos, Taxas e Reembolsos</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Os pagamentos são processados por parceiros financeiros. A VibeTicket cobra uma taxa de serviço 
              sobre cada ingresso vendido, informada ao Organizador na criação do evento e ao Comprador no 
              momento da compra.
            </p>
            <p className="Termos-paragrafo">
              Em caso de cancelamento, a política de reembolso será a estabelecida pelo Organizador. 
              As taxas de serviço da VibeTicket são não reembolsáveis.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">6. Doações</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              As doações realizadas através da plataforma são direcionadas às instituições indicadas pelos 
              Organizadores. A VibeTicket não se responsabiliza pela aplicação dos recursos doados, cabendo 
              ao Organizador e à instituição beneficiada a prestação de contas sobre o uso dos valores.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">7. Propriedade Intelectual</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Todo o conteúdo da plataforma (logotipos, marcas, código, design, texto) é de propriedade da 
              VibeTicket ou de seus licenciadores e está protegido por leis de propriedade intelectual.
            </p>
            <p className="Termos-paragrafo">
              O Organizador concede à VibeTicket uma licença para utilizar o conteúdo do evento exclusivamente 
              para fins de divulgação na plataforma.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">8. Privacidade e Dados</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Nossa coleta e uso de dados são regidos pela nossa Política de Privacidade. Adotamos medidas 
              de segurança técnicas e administrativas para proteger suas informações.
            </p>
            <p className="Termos-paragrafo">
              Ao comprar um ingresso, o Comprador concorda que seus dados de contato necessários podem ser 
              compartilhados com o Organizador do evento para fins de comunicação relacionada ao evento.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">9. Limitação de Responsabilidade</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              A VibeTicket não será responsabilizada por:
            </p>
            <ul className="Termos-paragrafo">
              <li>Problemas, cancelamentos, fraudes ou inadequações relacionados aos eventos</li>
              <li>Danos decorrentes do uso ou incapacidade de uso da plataforma</li>
              <li>Falhas em sistemas de terceiros, como provedores de pagamento</li>
              <li>Ações ou omissões dos usuários</li>
            </ul>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">10. Conduta do Usuário</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              É proibido utilizar a plataforma para:
            </p>
            <ul className="Termos-paragrafo">
              <li>Criar eventos que promovam atividades ilegais ou fraudulentas</li>
              <li>Fornecer informações falsas ou enganosas</li>
              <li>Violar direitos de propriedade intelectual de terceiros</li>
              <li>Praticar qualquer forma de discriminação ou assédio</li>
            </ul>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">11. Rescisão</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Estes Termos são válidos enquanto sua conta estiver ativa. A VibeTicket pode suspender ou 
              terminar seu acesso à plataforma a qualquer momento e por qualquer motivo, incluindo 
              violação destes Termos.
            </p>
          </div>
        </div>

        <div className="Termos-secao">
          <h3 className="Termos-titulo-secao">12. Atualizações</h3>
          <div className="Termos-texto">
            <p className="Termos-paragrafo">
              Estes Termos podem ser atualizados futuramente. Manteremos a versão mais recente disponível 
              nesta página, e seu uso continuado da plataforma significa que você aceita quaisquer mudanças.
            </p>
            <p className="Termos-paragrafo">
              Para dúvidas ou suporte, entre em contato pelo e-mail {' '}
              <a href="mailto:contato@vibeticket.com" className="Termos-link">
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