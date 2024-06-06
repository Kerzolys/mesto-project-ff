import "../pages/index.css";

import { createCardElement, likeCard, deleteCard } from "./components/card.js";

import {
  openPopup,
  closePopup,
  closePopupByOverlay,
} from "./components/modal.js";

import { clearValidation, enableValidation } from "./components/validation.js";

import {
  getUser,
  editUser,
  editUserAvatar,
  getInitialCards,
  addNewCardtoServer,
  deleteCardFromServer,
  putLike,
  deleteLike,
  handleError,
} from "./components/api.js";
import { config } from "./components/configAPI.js";
import { configValidation } from "./components/configValidation.js";

const placesList = document.querySelector(".places__list");

// modal popups ---------------------------------------------------------------------------------------------------------
const infoEditButton = document.querySelector(".profile__edit-button");
const infoEditModal = document.querySelector(".popup_type_edit");
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const editAvatarButton = document.querySelector(".profile__image");
const editAvatarModal = document.querySelector(".popup_type_avatar");
const cardDeleteConfirmationModal = document.querySelector(
  ".popup_type_delete-confirmation"
);
const closeButtons = document.querySelectorAll(".popup__close");
const popups = document.querySelectorAll(".popup");
const popupImg = document.querySelector(".popup__image");
const popupTypeImage = document.querySelector(".popup_type_image");
const popupTitle = document.querySelector(".popup__caption");

const openImg = (evt) => {
  popupImg.src = evt.target.src;
  popupImg.alt = evt.target.alt;
  popupTitle.textContent = evt.target.alt;
  openPopup(popupTypeImage);
};

// USER--------------------------------------

//вывод пользователя------------------------------------------------------------------------------------------------------------
const renderUser = (userObj, userData) => {
  userObj.name.textContent = userData.name;
  userObj.description.textContent = userData.about;
};

const renderAvatar = (userObj, userData) => {
  userObj.avatar.style.backgroundImage = `url(${userData.avatar})`;
};

let userId;

// formEditProfile ---------------------------------------------------------------------------------------------------------
const formEditProfile = document.forms["edit-profile"];

const nameInput = formEditProfile.elements.name;
const descriptionInput = formEditProfile.elements.description;

const editProfileFormRender = () => {
  nameInput.value = name.textContent;
  descriptionInput.value = description.textContent;
};

const handleEditInfoFormSubmit = (evt) => {
  evt.preventDefault();
  // отправляем на сервер новые данные профиля
  formEditProfile.querySelector(".button").textContent = "Сохранение...";

  editUser(config, {
    name: nameInput.value,
    about: descriptionInput.value,
  })
    .then(() => {
      name.textContent = nameInput.value;
      description.textContent = descriptionInput.value;
    })
    .catch((error) => handleError(error))
    .finally(() => {
      formEditProfile.querySelector(".button").textContent = "Сохранить";
    });

  closePopup(formEditProfile.closest(".popup"));
};

//formEditAvatar--------------------------
const formEditAvatar = document.forms["edit-avatar"];
const avatarInput = formEditAvatar.elements.link;

// userObj--------------------------------------
const name = document.querySelector(".profile__title");
const description = document.querySelector(".profile__description");
const avatar = document.querySelector(".profile__image");
// создаем объект для отрисовки
const user = {
  name: name,
  description: description,
  avatar: avatar,
};

const handleEditAvatarFormSubmit = (evt) => {
  evt.preventDefault();
  formEditAvatar.querySelector(".button").textContent = "Сохранение...";

  // отправляем на сервер новые данные (ссылку) аватара
  editUserAvatar(config, { avatar: avatarInput.value })
    .then(() => {
      //присваиваем новые данные элементу avatar (DOM)
      avatar.style.backgroundImage = `url(${avatarInput.value})`;
      closePopup(formEditAvatar.closest(".popup"));
    })
    .catch((error) => handleError(error))
    .finally(() => {
      formEditAvatar.querySelector(".button").textContent = "Сохранить";
      formEditAvatar.querySelector(".button").disabled = true;
      formEditAvatar
        .querySelector(".button")
        .classList.add("popup__button_disabled");
    });
};

//ВАЛИДАЦИЯ ФОРМ------------------------

enableValidation(configValidation);

//formNewCard------------------------------------------------------------------------------------------------------------------------------
const formAddNewCard = document.forms["new-place"];
const newPlace = formAddNewCard.elements["place-name"];
const link = formAddNewCard.elements.link;

const renderForm = (form) => {
  form.reset();
};

const handleNewCardSubmit = (evt) => {
  evt.preventDefault();
  // проверка на написание пользователем места - первую букву делаем заглавной
  const capitilized = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);
  // создаем объект новой карточки
  const newCardObj = {
    link: link.value,
    name: capitilized(newPlace.value),
    alt: capitilized(newPlace.value),
    likes: [],
  };

  formAddNewCard.querySelector(".button").textContent = "Создание карточки...";

  addNewCardtoServer(config, newCardObj)
    .then((cardData) => {
      const newCard = createCardElement(
        cardData,
        userId,
        handleLikeCard,
        openImg,
        handleDeleteCard
      );
      placesList.prepend(newCard);
      closePopup(formAddNewCard.closest(".popup"));
    })
    .finally(() => {
      formAddNewCard.querySelector(".button").textContent = "Создать";
      formAddNewCard.querySelector(".button").disabled = true;
      formAddNewCard
        .querySelector(".button")
        .classList.add("popup__button_disabled");
    });
};

// рендер карточек ---------------------------------------------------------------------------------------------------------
Promise.all([getInitialCards(config), getUser(config)]).then(
  ([allCards, userData]) => {
    renderUser(user, userData);
    renderAvatar(user, userData);
    userId = userData._id;
    allCards.forEach((card) => {
      const userId = userData._id;
      placesList.append(
        createCardElement(
          card,
          userId,
          handleLikeCard,
          openImg,
          handleDeleteCard
        )
      );
    });
  }
);

const handleDeleteCard = (cardEl, cardId) => {
  openPopup(cardDeleteConfirmationModal);
  formDeleteCardConfirmaion.addEventListener("submit", (evt) => {
    handleDeleteCardConfirmation(evt, cardEl, cardId);
  });
};

const handleLikeCard = (evt, cardId, likeCounter) => {
  if (evt.target.classList.contains("card__like-button_is-active")) {
    deleteLike(config, cardId).then((likes) => {
      likeCounter.textContent = likes.likes.length;
      likeCard(evt);
    });
  } else {
    putLike(config, cardId).then((likes) => {
      likeCounter.textContent = likes.likes.length;
      likeCard(evt);
    });
  }
};

// форма удаления карточки
const formDeleteCardConfirmaion = document.forms["delete-confirmation"];

const handleDeleteCardConfirmation = (evt, cardEl, cardId) => {
  evt.preventDefault();

  formDeleteCardConfirmaion.querySelector(".button").textContent =
    "Удаление карточки...";
  deleteCardFromServer(config, cardId)
    .then(() => {
      closePopup(cardDeleteConfirmationModal);
      deleteCard(cardEl);
    })
    .catch(handleError)
    .finally(() => {
      formDeleteCardConfirmaion.querySelector(".button").textContent = "Да";
    });
};

// обработчики событий ---------------------------------------------------------------------------------------------------------
infoEditButton.addEventListener("click", () => {
  //открываем попап
  openPopup(infoEditModal);
  //рендерим форму
  editProfileFormRender();
  clearValidation(configValidation, formEditProfile);
});

newCardButton.addEventListener("click", () => {
  //открываем форму
  openPopup(newCardModal);
  //рендерим форму
  renderForm(formAddNewCard);
  clearValidation(configValidation, formAddNewCard);
});

editAvatarButton.addEventListener("click", () => {
  openPopup(editAvatarModal);
  renderForm(formEditAvatar);
  clearValidation(configValidation, formEditAvatar);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    popups.forEach((popup) => {
      if (popup === button.closest(".popup")) {
        closePopup(popup);
      }
    });
  });
});

popups.forEach((popup) => {
  popup.addEventListener("click", closePopupByOverlay);
});

formEditProfile.addEventListener("submit", handleEditInfoFormSubmit);
formEditAvatar.addEventListener("submit", handleEditAvatarFormSubmit);
formAddNewCard.addEventListener("submit", handleNewCardSubmit);

