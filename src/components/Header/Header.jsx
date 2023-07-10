import React from "react";
import logo from "../../images/logo.svg";
import { Link, useLocation } from "react-router-dom";


export default function Header( {loggedIn, email, exit}) {
  const location = useLocation();
  return (
    <header className="header">
      <img src={logo} className="header__logo" alt="логотип Место" />
      {loggedIn ? (
        <div className="header__entry">
          <p>{email}</p>
          <Link className="header__link" to="/sign-in" onClick={exit}>
            Выйти
          </Link>
        </div>
      ) : (
        <Link
          className="header__button"
          to={location.pathname === "/sign-in" ? "/sign-up" : "/sign-in"}
        >
          {location.pathname === "/sign-in" ? "Регистрация" : "Войти"}
        </Link>
      )}
    </header>
  );
}