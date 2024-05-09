import "../pages/index.css";

import { initialCards } from "./cards.js";

import {
  createCardElement,
  deleteCardElement,
  likeCard,
  openImg,
} from "./components/card.js";

import { openModal, closeModal } from "./components/modal.js";

const placesList = document.querySelector(".places__list");

// modal popups ---------------------------------------------------------------------------------------------------------
const infoEditButton = document.querySelector(".profile__edit-button");
const infoEditModal = document.querySelector(".popup_type_edit");
const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
const closeButtons = document.querySelectorAll(".popup__close");
const popups = document.querySelectorAll(".popup");

const checkPopupToClose = () => {
  popups.forEach((popup) => {
    closeModal(popup);
    if (popup.classList.contains("popup_type_edit")) {
      editFormtRender();
    } else {
      newCardFormRender();
    }
  });
};

// formEditProfile ---------------------------------------------------------------------------------------------------------
const formEditInfo = document.forms["edit-profile"];
const name = document.querySelector(".profile__title");
const occupation = document.querySelector(".profile__description");
const nameInput = formEditInfo.elements.name;
const occupationInput = formEditInfo.elements.description;

const editFormtRender = () => {
  nameInput.value = name.textContent;
  occupationInput.value = occupation.textContent;
};

editFormtRender();

const handleFormSubmit = (evt) => {
  evt.preventDefault();

  name.textContent = nameInput.value;
  occupation.textContent = occupationInput.value;

  closeModal(evt.target.closest(".popup"));
};

//formNewCard------------------------------------------------------------------------------------------------------------------------------
const formAddNewCard = document.forms["new-place"];
const newPlace = formAddNewCard.elements["place-name"];
const link = formAddNewCard.elements.link;

const newCardFormRender = () => {
  link.value = "";
  newPlace.value = "";
};

const handleNewCardSubmit = (evt) => {
  evt.preventDefault();
  // проверка на написание пользователем места - первую букву делаем заглавной
  const capitilized = (string) => string.charAt(0).toUpperCase() + string.slice(1);


  let newCard = createCardElement(
    link.value,
    capitilized(newPlace.value),
    capitilized(newPlace.value),
    deleteCardElement,
    likeCard,
    openImg
  );

  initialCards.unshift({
    name: newPlace.value,
    link: link.value,
    alt: newPlace.value,
  });
  placesList.prepend(newCard);

  closeModal(evt.target.closest(".popup"));

  newCardFormRender();
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
  openModal(infoEditModal);
});

newCardButton.addEventListener("click", () => {
  openModal(newCardModal);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    checkPopupToClose();
  });
});

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape") {
    checkPopupToClose();
  }
});

popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("popup")) {
      checkPopupToClose();
      closeModal(popup);
    }
  });
});

formEditInfo.addEventListener("submit", handleFormSubmit);
formAddNewCard.addEventListener("submit", handleNewCardSubmit);
