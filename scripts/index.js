// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const placesList = document.querySelector(".places__list");

const createCardElement = (imgValue, altValue, titleValue, deleteFn) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardDeleteButton.addEventListener("click", deleteFn);

  cardElement.querySelector(".card__image").src = imgValue;
  cardElement.querySelector(".card__image").alt = altValue;
  cardElement.querySelector(".card__title").textContent = titleValue;

  return cardElement;
};

let deleteCardElement = (evt) => evt.target.closest('.card').remove();

initialCards.forEach((item) => {
  placesList.append(createCardElement(item.link, item.alt, item.name, deleteCardElement));
});
