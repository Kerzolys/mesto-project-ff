const openPopup = (modal) => {
  modal.classList.add("popup_is-opened");
  modal.classList.remove("popup_is-animated");

  document.addEventListener("keydown", closePopupByEsc);
};

const closePopup = (modal) => {
  modal.classList.add("popup_is-animated");
  modal.classList.remove("popup_is-opened");

  document.removeEventListener("click", closePopupByEsc);
};

const closePopupByEsc = (evt) => {
  if (evt.key === "Escape") {
    closePopup(document.querySelector(".popup_is-opened"));
  }
};

const closePopupByOverlay = (evt) => {
  if (evt.target.classList.contains("popup")) {
    closePopup(evt.currentTarget);
  }
};

export { openPopup, closePopup, closePopupByOverlay };
