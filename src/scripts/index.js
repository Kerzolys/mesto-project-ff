import "../pages/index.css";

import { createCardElement, likeCard } from "./components/card.js";

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

const openImg = (evt) => {
  const popupImg = document.querySelector(".popup__image");
  const popupTypeImage = document.querySelector(".popup_type_image");
  const popupTitle = document.querySelector(".popup__caption");
  popupImg.src = evt.target.src;
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

getUser(config).then((userData) => {
  renderUser(user, userData);
  renderAvatar(user, userData);
  userId = userData._id;
});

// formEditProfile ---------------------------------------------------------------------------------------------------------
const formEditProfile = document.forms["edit-profile"];

const nameInput = formEditProfile.elements.name;
const descriptionInput = formEditProfile.elements.description;
// console.log(formEditProfile.querySelector('.button').textContent)
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
  }).finally(() => {
    formEditProfile.querySelector(".button").textContent = "Сохранить";
  });

  name.textContent = nameInput.value;
  description.textContent = descriptionInput.value;

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
  editUserAvatar(config, { avatar: avatarInput.value }).finally(() => {
    formEditAvatar.querySelector(".button").textContent = "Сохранить";
  });
  //присваеваем новые данные элементу avatar (DOM)
  avatar.style.backgroundImage = `url(${avatarInput.value})`;

  closePopup(formEditAvatar.closest(".popup"));
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
  const newCard = createCardElement(newCardObj, likeCard, openImg);
  formAddNewCard.querySelector(".button").textContent = "Создание карточки...";

  addNewCardtoServer(config, newCardObj)
    .then((cardData) => console.log(cardData))
    .finally(() => {
      formAddNewCard.querySelector(".button").textContent = "Создать";
      renderCards()
    });

  placesList.prepend(newCard);

  closePopup(formAddNewCard.closest(".popup"));
};

// форма удаления карточки
const formDeleteCardConfirmaion = document.forms["delete-confirmation"];

// рендер карточек ---------------------------------------------------------------------------------------------------------
const renderCards = () => {
  getInitialCards(config).then((cards) => {
    const allCards = cards;
    // вывод всех карточек
    allCards.forEach((card) => {
      placesList.append(createCardElement(card, likeCard, openImg));
    });
    // получаем массив DOM-карточек
    const cardsArray = placesList.querySelectorAll(".card");
    // рендер карточек без кнопки удаления
    allCards.filter((card, notMyCardIndex) => {
      if (card.owner._id !== userId) {
        cardsArray[notMyCardIndex].querySelector(
          ".card__delete-button"
        ).style.display = "none";
      }
    });
    // рендеринг отлайканных мною карточек
    allCards.forEach((card, cardIndex) => {
      card.likes.forEach((cardLike) => {
        if (cardLike._id === userId) {
          cardsArray[cardIndex]
            .querySelector(".card__like-button")
            .classList.add("card__like-button_is-active");
        }
      });
    });
    // взаимодействие с карточкой: удаление, лайк и анлайк
    cardsArray.forEach((card, index) => {
      //назодим элементы для взаимодействия
      const cardDeleteButton = card.querySelector(".card__delete-button");
      const cardLikeButton = card.querySelector(".card__like-button");
      const cardLikeCounter = card.querySelector(".card__like-counter");
      //удаление карточки
      cardDeleteButton.addEventListener("click", () => {
        openPopup(cardDeleteConfirmationModal);
        formDeleteCardConfirmaion.addEventListener("submit", (evt) => {
          evt.preventDefault();
          formDeleteCardConfirmaion.querySelector(".button").textContent =
            "Удаление карточки...";
          deleteCardFromServer(config, cards[index]._id)
            .then(() => {
              closePopup(cardDeleteConfirmationModal);
              cardsArray[index].remove();
            })
            .finally(() => {
              formDeleteCardConfirmaion.querySelector(".button").textContent =
                "Да";
            });
        });
      });
      //лайк/анлайк
      cardLikeButton.addEventListener("click", () => {
        //проверка на наличие класса лайка у кнопки лайка
        if (cardLikeButton.classList.contains("card__like-button_is-active")) {
          deleteLike(config, cards[index]._id).then((likes) => {
            cardLikeCounter.textContent = likes.likes.length;
          });
        } else {
          putLike(config, cards[index]._id).then((likes) => {
            cardLikeCounter.textContent = likes.likes.length;
          });
        }
      });
    });
  });
};

renderCards()
// обработчики событий ---------------------------------------------------------------------------------------------------------
infoEditButton.addEventListener("click", () => {
  //открываем попап
  openPopup(infoEditModal);
  //рендерим форму
  editProfileFormRender();
  clearValidation(
    {
      formSelector: ".popup__form",
      inputSelector: ".popup__input",
      inputErrorClass: "popup__input_error",
      errorClass: "popup__input_type-error_active",
    },
    formEditProfile
  );
});

newCardButton.addEventListener("click", () => {
  //открываем форму
  openPopup(newCardModal);
  //рендерим форму
  renderForm(formAddNewCard);
  clearValidation(
    {
      formSelector: ".popup__form",
      inputSelector: ".popup__input",
      inputErrorClass: "popup__input_error",
      errorClass: "popup__input_type-error_active",
    },
    formAddNewCard
  );
});

editAvatarButton.addEventListener("click", () => {
  openPopup(editAvatarModal);
  renderForm(formEditAvatar);
  clearValidation(
    {
      formSelector: ".popup__form",
      inputSelector: ".popup__input",
      inputErrorClass: "popup__input_error",
      errorClass: "popup__input_type-error_active",
    },
    formEditAvatar
  );
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
