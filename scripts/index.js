// @todo: Темплейт карточки 

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const placesList = document.querySelector(".places__list");

let createCardContent = (imgValue, titleValue, deleteFn) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");

  deleteButton.addEventListener("click", deleteFn);

  cardElement.querySelector(".card__image").src = imgValue;
  cardElement.querySelector(".card__title").textContent = titleValue;

  return cardElement;
};

let deleteCard = (evt) => {
  evt.target.parentNode.remove();
};

initialCards.forEach((item) => {
  placesList.append(createCardContent(item.link, item.name, deleteCard));
});
