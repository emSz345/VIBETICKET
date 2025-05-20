import React from "react";
import "../../styles/Painel.css"

import logo from "../../assets/img-logo.png";

function Painel() {
    return (
        <div className="painel-container">
            <header className="painel-container-header">
                <div className="painel-div-conteudo">
                    <img src={logo} alt="Logo B4Y" className="painel-logo"/>
                    <hr className="painel-hr"/>
                    <h3 className="painel-header-title">Painel de administração</h3>
                </div>
            </header>
        </div>
    )
}

export default Painel;