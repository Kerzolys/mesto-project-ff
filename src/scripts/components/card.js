const deleteCardElement = (evt) => evt.target.closest(".card").remove();

const likeCard = (evt) => {
  if (evt.target.classList.contains("card__like-button")) {
    evt.target.classList.toggle("card__like-button_is-active");
  }
};

const createCardElement = (
  imgValue,
  altValue,
  titleValue,
  deleteFn,
  likeFn,
  openFn
) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardDeleteButton.addEventListener("click", deleteFn);
  cardElement.addEventListener("click", likeFn);
  cardElement.querySelector(".card__image").addEventListener("click", openFn);

  cardElement.querySelector(".card__image").src = imgValue;
  cardElement.querySelector(".card__image").alt = altValue;
  cardElement.querySelector(".card__title").textContent = titleValue;

  return cardElement;
};

export { createCardElement, deleteCardElement, likeCard };