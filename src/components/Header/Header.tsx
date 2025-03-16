import React from "react";
import "./Header.css";
import logo from "../../assets/img-logo.png";

const Header: React.FC = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header-logo" />
    </header>
  );
};

export default Header;
