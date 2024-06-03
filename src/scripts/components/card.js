const likeCard = (evt) => {
  if (evt.target.classList.contains("card__like-button")) {
    evt.target.classList.toggle("card__like-button_is-active");
  }
};

const handleImageError = (cardEl, card, cardImage) => {
  cardEl.classList.add("card__description_error");
  const newCardSpanError = document.createElement("span");
  newCardSpanError.textContent = "Изображение не загружено";
  newCardSpanError.style.cssText =
    "font-family: inherit; color: #fff; position: relative; inset-block-start: 34%; inset-inline-start: 15px";
  card.prepend(newCardSpanError);
  cardImage.remove();
};

const handleImageOnload = (cardEl) => {
  cardEl.classList.remove("card__description_error");
};

const createCardElement = (card, likeFn, openFn) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  const cardImage = cardElement.querySelector(".card__image");
  const cardDescription = cardElement.querySelector(".card__description");

  cardImage.onerror = () =>
    handleImageError(cardDescription, cardElement, cardImage);

  cardImage.onload = () => handleImageOnload(cardDescription);

  cardElement.addEventListener("click", likeFn);
  cardElement.querySelector(".card__image").addEventListener("click", openFn);

  cardElement.querySelector(".card__image").src = card.link;
  cardElement.querySelector(".card__image").alt = card.name;
  cardElement.querySelector(".card__title").textContent = card.name;
  cardElement.querySelector(".card__like-counter").textContent =
    card.likes.length;

  return cardElement;
};

export { createCardElement, likeCard };
