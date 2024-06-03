// функции для отрисовки ошибок
const showInputError = (
  validationConfig,
  formElement,
  inputElement,
  errorMessage
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (validationConfig, formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);

  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = "";
};

// проверка на валидность одного импута
const isValid = (validationConfig, formElement, inputElement) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessagePattern);
  } else if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessageMissing);
  } else {
    inputElement.setCustomValidity("");
  }

  if (inputElement.validity.valid) {
    hideInputError(validationConfig, formElement, inputElement);
  } else {
    showInputError(
      validationConfig,
      formElement,
      inputElement,
      inputElement.validationMessage
    );
  }
};

//проверка на НЕвалидность массива импутов
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

//отрисовка состояния кнопки
const toggleButtonState = (validationConfig, inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

// добавление обработчиков на форму
const setEventListeners = (validationConfig, formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const formButton = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  toggleButtonState(validationConfig, inputList, formButton);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(validationConfig, formElement, inputElement);
      toggleButtonState(validationConfig, inputList, formButton);
    });
  });
};

// находим список инпутов редактирования профиля и очищаем их от ошибок, если таковые были
const clearValidation = (validationConfig, formElement) => {
  Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  ).forEach((inputElement) => {
    hideInputError(validationConfig, formElement, inputElement);
  });
};

// const clearValidation = () => {
// };

const enableValidation = (validationConfig) => {
  const formList = document.querySelectorAll(validationConfig.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(validationConfig, formElement);
  });
};

export { clearValidation, enableValidation };
