import React from "react";
import { Link } from 'react-router-dom'
import "./Header.css";
import logo from "../../assets/img-logo.png";

const Header: React.FC = () => {
  return (
    <header className="header">
      <Link to="/Home">
        <img src={logo} alt="Logo" className="header-logo" />
      </Link>
    </header>
  );
};

export default Header;
