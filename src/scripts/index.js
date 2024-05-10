import "../pages/index.css";

import { initialCards } from "./cards.js";

import {
  createCardElement,
  deleteCardElement,
  likeCard,
} from "./components/card.js";

import {
  openPopup,
  closePopup,
  closePopupByOverlay,
} from "./components/modal.js";

const placesList = document.querySelector(".places__list");

// modal popups ---------------------------------------------------------------------------------------------------------
const infoEditButton = document.querySelector(".profile__edit-button");
const infoEditModal = document.querySelector(".popup_type_edit");
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
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

// formEditProfile ---------------------------------------------------------------------------------------------------------
const formEditInfo = document.forms["edit-profile"];
const name = document.querySelector(".profile__title");
const occupation = document.querySelector(".profile__description");
const nameInput = formEditInfo.elements.name;
const occupationInput = formEditInfo.elements.description;

const editInfoFormRender = () => {
  nameInput.value = name.textContent;
  occupationInput.value = occupation.textContent;
};

const handleEditInfoFormSubmit = (evt) => {
  evt.preventDefault();

  name.textContent = nameInput.value;
  occupation.textContent = occupationInput.value;

  closePopup(formEditInfo.closest(".popup"));
};

//formNewCard------------------------------------------------------------------------------------------------------------------------------
const formAddNewCard = document.forms["new-place"];
const newPlace = formAddNewCard.elements["place-name"];
const link = formAddNewCard.elements.link;

const newCardFormRender = () => {
  formAddNewCard.reset();
};

const handleNewCardSubmit = (evt) => {
  evt.preventDefault();
  // проверка на написание пользователем места - первую букву делаем заглавной
  const capitilized = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const newCard = createCardElement(
    link.value,
    capitilized(newPlace.value),
    capitilized(newPlace.value),
    deleteCardElement,
    likeCard,
    openImg
  );

  placesList.prepend(newCard);

  closePopup(formAddNewCard.closest(".popup"));
};

// вывод карточек ---------------------------------------------------------------------------------------------------------
initialCards.forEach((item) => {
  placesList.append(
    createCardElement(
      item.link,
      item.alt,
      item.name,
      deleteCardElement,
      likeCard,
      openImg
    )
  );
});

// обработчики событий ---------------------------------------------------------------------------------------------------------
infoEditButton.addEventListener("click", () => {
  openPopup(infoEditModal);
  editInfoFormRender();
});

newCardButton.addEventListener("click", () => {
  openPopup(newCardModal);
  newCardFormRender();
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

formEditInfo.addEventListener("submit", handleEditInfoFormSubmit);
formAddNewCard.addEventListener("submit", handleNewCardSubmit);
