import React from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  console.log('redering login')

  function handleSubmit(event) {
    event.preventDefault();
    console.log('handleSubmit')
    // if (!email || !password) {
    //   return;
    // }
    onLogin(password, email);
  }

  function handleChangeEmail(event) {
    console.log('handleChangeEmail')
    setEmail(event.target.value);
  }

  function handleChangePassword(event) {
    console.log('handleChangePassword')
    setPassword(event.target.value);
  }

  return (
    <section className="enter">
      <div className="registration__container">
        <form
          className="registration__form"
          name="registrationForm"
          onSubmit={handleSubmit}
        >
          <h2 className="registration__title">Вход</h2>
          <div className="registration__wrapper">
            <input
              className="registration__input registration__input_type_email"
              id="registration__email"
              type="email"
              placeholder="Email"
              minLength="2"
              maxLength="40"
              value={email}
              required={true}
              onChange={handleChangeEmail}
            />
            <span
              className="registration__error"
              id="registration__name-error"
            ></span>
          </div>
          <div className="registration__wrapper">
            <input
              className="registration__input registration__input_type_password"
              id="popup__password"
              type="password"
              placeholder="Пароль"
              minLength="2"
              maxLength="200"
              value={password}
              required={true}
              onChange={handleChangePassword}
            />
            <span
              className="registration__error"
              id="registration__job-error"
            ></span>
          </div>
          <button
            type="submit"
            className="registration__submit-button registration__submit-button_valid"
          >
            Войти
          </button>
        </form>
      </div>
    </section>
  );
}
