import * as auth from "../utils/auth.js";
import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import ImagePopup from "./ImagePopup/ImagePopup.jsx";
import Footer from "./Footer/Footer.jsx";
import api from "../utils/api.js";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from "./EditAvatarPopup/EditAvatarPopup.jsx";
import AddPlacePopup from "./AddPlacePopup/AddPlacePopup.jsx";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup.jsx";
import InfoTooltip from "./InfoTooltip/InfoTooltip.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";


function App() {
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteCardID, setDeleteCardID] = useState("");
  const [isInfoTooltip, setIsInfoTooltip] = React.useState({
    isOpen: false,
    isSucessfull: false,
  });
  // Авторизация юзера
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // Данные пользователя
  const [currentUser, setCurrentUser] = useState({});
  // Данные карточек
  const [cards, setCards] = useState([]);

  //Проверяем токен и перенаправление юзера
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth.getUserToken(token).then((data) => {
        if (data) {
          setEmail(data.data.email);
          handleLoggedIn();
          history.push("/");
        }
      });
    }
  }, [history]);

  function handleLoggedIn() {
    setLoggedIn(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsDeletePopupOpen(false);
    setIsInfoTooltip(
      {
        isOpen: false,
        isSucessfull: false,
      }
    )
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeleteClick(cardId) {
    setIsDeletePopupOpen(true);
    setDeleteCardID(cardId);
  }

  function handleCardDeleteSubmit(cardId) {
    api
      .removeCard(cardId)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== cardId));
        closeAllPopups();
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }

  function handleInfoTooltip(effect) {
    setIsInfoTooltip({ ...isInfoTooltip, isOpen: true, isSucessfull: effect });
  }

  function handleExit() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    history.push("/signin");
  }

  // Лайки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }

  function handleUpdateAvatar(pic) {
    api
      .changeAvatar(pic)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }

  function handleUpdateUser(data) {
    api
      .changeProfile(data)
      .then((infoUser) => {
        setCurrentUser(infoUser);
        closeAllPopups();
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }

  function handleAddPlaceSubmit(cardData) {
    api
      .addNewCard(cardData)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }

  function handleRegister(password, email) {
    auth
      .register(password, email)
      .then((data) => {
        if (data) {
          handleInfoTooltip(true);
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.log(error);
        handleInfoTooltip(false);
      });
  }

  function handleLogin(password, email) {
    auth
      .login(password, email)
      .then((data) => {
        if (data.token) {
          setEmail(email);
          setLoggedIn(true);
          localStorage.setItem("token", data.token);
          history.push("/");
        }
      })
      .catch((error) => {
        handleInfoTooltip(false);
        console.log(error);
      });
  }

  useEffect(() => {
    Promise.all([api.getInfoUser(), api.getInitialCards()])
      .then(([infoUser, infoCard]) => {
        setCurrentUser(infoUser);
        setCards(infoCard);
      })
      .catch((error) => console.error(`Ошибка ${error}`));
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
        <Header email={email} exit={handleExit} />
        <Switch>
          <Route path="/signin">
            {console.log('going to login')}
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/signup">
            {console.log('going to register')}
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="/">
            <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleDeleteClick}
                onCardLike={handleCardLike}
                cards={cards}
              />
          </Route>
        </Switch>



        {/* <Routes>
          <Route>
            {loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />}
          </Route>
        </Routes>  */}
       

        <Footer />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ConfirmPopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDeleteSubmit}
          card={deleteCardID}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip 
          effect={isInfoTooltip}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
