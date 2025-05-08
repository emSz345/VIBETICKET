import { Link } from "react-router-dom";

import "../styles/Duvidas.css"
import logo from "../assets/img-logo.png";



function Duvidas() {
    return (
        <div className="pagina-termos">
            <header className="duvidas-header">
                <Link to="/Home">
                    <img src={logo} alt="Logo" className="duvidas-header-logo" />
                </Link>
                <hr className="duvida-hr" />
                <h3 className="duvidas-title">Dúvidas e Suporte</h3>
            </header>
            <div className="main">
               
            </div>
        </div>
    );
}

export default Duvidas;  