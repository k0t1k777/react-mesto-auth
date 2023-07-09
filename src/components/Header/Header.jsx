import React from "react";
import logo from "../../images/logo.svg";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="логотип Место" />
      <Link className="header__link" to="#">
        Регистрация
      </Link>
    </header>
  );
}
