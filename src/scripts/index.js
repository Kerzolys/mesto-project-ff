import "../pages/index.css";

import { createCardElement, likeCard, deleteCard } from "./components/card.js";

import {
  openPopup,
  closePopup,
  closePopupByOverlay,
} from "./components/modal.js";

import { clearValidation, enableValidation } from "./components/validation.js";
import { apiFns, handleError } from "./components/api.js";
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

const disableSubmitButton = (form) => {
  form.querySelector(".button").disabled = true;
  form.querySelector(".button").classList.add("popup__button_disabled");
};

const handleSubmitButtonTextContent = (form, text) => {
  form.querySelector(".button").textContent = text;
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
  handleSubmitButtonTextContent(formEditProfile, "Сохранение...");

  apiFns
    .editUser(config, {
      name: nameInput.value,
      about: descriptionInput.value,
    })
    .then(() => {
      name.textContent = nameInput.value;
      description.textContent = descriptionInput.value;
      closePopup(formEditProfile.closest(".popup"));
    })
    .catch((error) => handleError(error))
    .finally(() => {
      handleSubmitButtonTextContent(formEditProfile, "Сохранить");
    });
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
  handleSubmitButtonTextContent(formEditAvatar, "Сохранение...");
  // отправляем на сервер новые данные (ссылку) аватара
  apiFns
    .editUserAvatar(config, { avatar: avatarInput.value })
    .then(() => {
      //присваиваем новые данные элементу avatar (DOM)
      avatar.style.backgroundImage = `url(${avatarInput.value})`;
      closePopup(formEditAvatar.closest(".popup"));
    })
    .catch((error) => handleError(error))
    .finally(() => {
      handleSubmitButtonTextContent(formEditAvatar, "Сохранить");
      disableSubmitButton(formEditAvatar);
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

  handleSubmitButtonTextContent(formAddNewCard, "Создание карточки...");

  apiFns
    .addNewCardtoServer(config, newCardObj)
    .then((cardData) => {
      const newCard = createCardElement(cardData, userId, handleCardFns);
      placesList.prepend(newCard);
      closePopup(formAddNewCard.closest(".popup"));
    })
    .finally(() => {
      handleSubmitButtonTextContent(formAddNewCard, "Создать");
      disableSubmitButton(formAddNewCard);
    });
};

// рендер карточек ---------------------------------------------------------------------------------------------------------
let userId;

export const handleCardFns = {
  handlelikeFn: (evt, cardId, likeCounter) => {
    // evt - event.target для отрисовки лайка
    // cardId - айди карточки для лайка
    // likeCounter - элемент для отрисовки кол-ва лайков
    if (evt.target.classList.contains("card__like-button_is-active")) {
      apiFns.deleteLike(config, cardId).then((likes) => {
        likeCounter.textContent = likes.likes.length;
        likeCard(evt);
      });
    } else {
      apiFns.putLike(config, cardId).then((likes) => {
        likeCounter.textContent = likes.likes.length;
        likeCard(evt);
      });
    }
  },
  openFn: (evt) => {
    popupImg.src = evt.target.src;
    popupImg.alt = evt.target.alt;
    popupTitle.textContent = evt.target.alt;
    openPopup(popupTypeImage);
  },
  handleDeleteFn: (cardEl, cardId) => {
    // cardEl - DOM элемент карточки
    // cardId - айди карточки для лайка
    openPopup(cardDeleteConfirmationModal);
    formDeleteCardConfirmaion.addEventListener("submit", (evt) => {
      handleDeleteCardConfirmation(evt, cardEl, cardId);
    });
  },
};

Promise.all([apiFns.getInitialCards(config), apiFns.getUser(config)]).then(
  ([allCards, userData]) => {
    renderUser(user, userData);
    renderAvatar(user, userData);
    userId = userData._id;
    allCards.forEach((card) => {
      const userId = userData._id;
      placesList.append(createCardElement(card, userId, handleCardFns));
    });
  }
);

// форма удаления карточки
const formDeleteCardConfirmaion = document.forms["delete-confirmation"];

const handleDeleteCardConfirmation = (evt, cardEl, cardId) => {
  evt.preventDefault();
  handleSubmitButtonTextContent(
    formDeleteCardConfirmaion,
    "Удаление карточки..."
  );
  apiFns
    .deleteCardFromServer(config, cardId)
    .then(() => {
      closePopup(cardDeleteConfirmationModal);
      deleteCard(cardEl);
    })
    .catch(handleError)
    .finally(() => {
      handleSubmitButtonTextContent(formDeleteCardConfirmaion, "Да");
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
