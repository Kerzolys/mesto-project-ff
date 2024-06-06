const deleteCard = (el) => {
  el.remove();
};

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

const createCardElement = (
  cardData,
  userId,
  handleCardFns
) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCounter = cardElement.querySelector(".card__like-counter");

  const ownerId = cardData.owner._id;

  if (ownerId !== userId) {
    cardDeleteButton.style.display = "none";
  }
  cardDeleteButton.addEventListener("click", (evt) => {
    handleCardFns.handleDeleteFn(cardElement, cardData._id);
  });
  const cardImage = cardElement.querySelector(".card__image");
  const cardDescription = cardElement.querySelector(".card__description");

  cardImage.onerror = () =>
    handleImageError(cardDescription, cardElement, cardImage);

  cardImage.onload = () => handleImageOnload(cardDescription);

  cardData.likes.forEach((like) => {
    if (like._id === userId) {
      cardLikeButton.classList.add("card__like-button_is-active");
    }
  });

  cardLikeButton.addEventListener("click", (evt) => {
    handleCardFns.handlelikeFn(evt, cardData._id, cardLikeCounter);
  });
  cardElement.querySelector(".card__image").addEventListener("click", handleCardFns.openFn);

  cardElement.querySelector(".card__image").src = cardData.link;
  cardElement.querySelector(".card__image").alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  cardElement.querySelector(".card__like-counter").textContent =
    cardData.likes.length;

  return cardElement;
};

export { createCardElement, likeCard, deleteCard };
