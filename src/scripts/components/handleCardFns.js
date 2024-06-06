export const handleCardFns = {
  handleLikeCard: (evt, cardId, likeCounter) => {
    // evt - event.target для отрисовки лайка
    // cardId - айди карточки для лайка
    // likeCounter - элемент для отрисовки кол-ва лайков
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
  },
  openFn: (evt) => {
    popupImg.src = evt.target.src;
    popupImg.alt = evt.target.alt;
    popupTitle.textContent = evt.target.alt;
    openPopup(popupTypeImage);
  },
  handleDeleteCard: (cardEl, cardId) => {
    // cardEl - DOM элемент карточки
    // cardId - айди карточки для лайка
    openPopup(cardDeleteConfirmationModal);
    formDeleteCardConfirmaion.addEventListener("submit", (evt) => {
      handleDeleteCardConfirmation(evt, cardEl, cardId);
    });
  },

}