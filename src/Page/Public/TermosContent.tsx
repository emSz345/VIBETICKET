import Footer from "../../components/layout/Footer/Footer";
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
                        <strong className="TermosContent-strong">1. Uso da Plataforma:</strong> Nossa plataforma permite que usuários criem eventos, 
                        comprem ingressos e realizem doações para instituições. O usuário é responsável por 
                        fornecer informações corretas ao se cadastrar e deve utilizar o serviço de forma legal 
                        e ética. O uso indevido pode levar à suspensão ou remoção da conta.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">2. Responsabilidade dos Organizadores:</strong> Os organizadores são totalmente 
                        responsáveis pelos eventos criados, incluindo sua realização, possíveis cancelamentos 
                        e reembolsos. A plataforma atua apenas como intermediária e não se responsabiliza por 
                        problemas nos eventos. Empresas que fizerem grandes doações poderão ser destacadas 
                        como patrocinadores no site.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">3. Privacidade e Segurança dos Dados:</strong> Para garantir a melhor experiência, 
                        armazenamos informações dos usuários em nosso banco de dados de forma segura e protegida. 
                        Adotamos medidas para garantir a confidencialidade e integridade dos dados, seguindo 
                        boas práticas de segurança. Não compartilhamos informações pessoais sem consentimento, 
                        salvo quando exigido por lei.
                    </p>
                </div>

                <div className="TermosContent-termos-texto">
                    <p className="TermosContent-p">
                        <strong className="TermosContent-strong">4. Modificações dos Termos:</strong> Nos reservamos o direito de modificar estes 
                        termos a qualquer momento, e o uso contínuo da plataforma após atualizações implica 
                        na aceitação das novas condições. Para dúvidas ou suporte, entre em contato pelo 
                        e-mail [e-mail de contato].
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