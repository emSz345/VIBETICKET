import '../../styles/TermosContent.css'
import Button from "../../components/ui/Button/Button";

interface TermosProps {
    onClose: () => void;
}

const TermosContent: React.FC<TermosProps> = ({ onClose }) => {
    return (
        <div>
            <div className="TermosContent-container-title">
                <h3>Termos de uso da plataforma <span>VibeTicket</span></h3>
            </div>
            <div className="TermosContent-termos-container">
                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        Bem-vindo à VibeTicket. Ao utilizar nossos serviços, você concorda com estes Termos de Uso.
                        Caso não concorde, pedimos que não utilize a plataforma.
                    </p>
                </div>

                <hr />

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">1. Aceitação dos Termos:</strong> Estes Termos de Uso regulam a relação entre a plataforma VibeTicket, seus usuários ("Você"), sejam Organizadores ou Compradores. Ao se cadastrar ou utilizar nossos serviços, você declara ter lido, compreendido e aceitado integralmente todas as condições aqui estabelecidas. A <a href="/politica-de-privacidade" target="_blank">Política de Privacidade</a> é parte integrante destes Termos.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">2. Cadastro e Conta:</strong> O cadastro é pessoal e intransferível. Você é o único responsável pela segurança de sua senha e por toda e qualquer atividade que ocorra em sua conta. É obrigatório fornecer informações verídicas, completas e atualizadas. A VibeTicket se reserva o direito de recusar, suspender ou cancelar contas que violem estes Termos.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">3. Serviços da Plataforma:</strong> A VibeTicket atua como uma mera intermediária tecnológica, disponibilizando um ambiente para que Organizadores criem e promovam eventos e Compradores adquiram ingressos e realizem doações. A plataforma <strong>não é</strong> a organizadora dos eventos, nem se responsabiliza por sua execução, qualidade ou segurança.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">4. Responsabilidades dos Organizadores:</strong> O Organizador é integral e exclusivamente responsável por:
                        <br />- Todas as informações divulgadas sobre o evento (data, local, atrativos, restrições);
                        <br />- O cumprimento de todas as obrigações legais, fiscais e trabalhistas relacionadas ao evento;
                        <br />- A prestação de contas claras sobre as doações recebidas;
                        <br />- Estabelecer e cumprir política de reembolso em caso de cancelamento ou adiamento;
                        <br />- Assegurar que o evento não infrinja direitos de terceiros.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">5. Pagamentos, Taxas e Reembolsos:</strong> Os pagamentos são processados por parceiros financeiros. A VibeTicket cobra uma taxa de serviço sobre cada ingresso vendido, informada ao Organizador na criação do evento e ao Comprador no momento da compra. Em caso de cancelamento, a política de reembolso será a estabelecida pelo Organizador. As taxas de serviço da VibeTicket são não reembolsáveis.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">6. Doações:</strong> As doações realizadas através da plataforma são direcionadas às instituições indicadas pelos Organizadores. A VibeTicket não se responsabiliza pela aplicação dos recursos doados, cabendo ao Organizador e à instituição beneficiada a prestação de contas sobre o uso dos valores. Empresas que fizerem grandes doações poderão ser destacadas como patrocinadores.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">7. Propriedade Intelectual:</strong> Todo o conteúdo da plataforma (logotipos, marcas, código, design, texto) é de propriedade da VibeTicket ou de seus licenciadores e está protegido por leis de propriedade intelectual. O Organizador concede à VibeTicket uma licença para utilizar o conteúdo do evento exclusivamente para fins de divulgação na plataforma.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">8. Privacidade e Dados:</strong> Nossa coleta e uso de dados são regidos pela nossa <a href="/politica-de-privacidade" target="_blank">Política de Privacidade</a>. Ao comprar um ingresso, o Comprador concorda que seus dados de contato necessários podem ser compartilhados com o Organizador do evento para fins de comunicação relacionada ao evento.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">9. Limitação de Responsabilidade:</strong> A VibeTicket não será responsabilizada por:
                        <br />- Problemas, cancelamentos, fraudes ou inadequações relacionados aos eventos;
                        <br />- Danos decorrentes do uso ou incapacidade de uso da plataforma;
                        <br />- Falhas em sistemas de terceiros, como provedores de pagamento;
                        <br />- Ações ou omissões dos usuários.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">10. Conduta do Usuário:</strong> É proibido utilizar a plataforma para:
                        <br />- Criar eventos que promovam atividades ilegais ou fraudulentas;
                        <br />- Fornecer informações falsas ou enganosas;
                        <br />- Violar direitos de propriedade intelectual de terceiros;
                        <br />- Praticar qualquer forma de discriminação ou assédio.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">11. Rescisão:</strong> Estes Termos são válidos enquanto sua conta estiver ativa. A VibeTicket pode suspender ou terminar seu acesso à plataforma a qualquer momento e por qualquer motivo, incluindo violação destes Termos.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">12. Atualizações:</strong> Estes Termos podem ser atualizados futuramente. Manteremos a versão mais recente disponível nesta página, e seu uso continuado da plataforma significa que você aceita quaisquer mudanças.
                    </p>

                    <div className="TermosContent-button-container">
                        <Button text="Concordo" color="Blue" onClick={onClose} />
                        <Button text="Não concordo" color="Red" onClick={() => window.location.reload()} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TermosContent;