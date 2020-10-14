'use strict';

(() => {
  const mainElement = document.querySelector(`main`);
  const successAlertElement = document.querySelector(`#success`).content.querySelector(`.success`).cloneNode(true);
  const successButtonElement = successAlertElement.querySelector(`.success__button`);
  const errorAlertElement = document.querySelector(`#error`).content.querySelector(`.error`).cloneNode(true);
  const errorTitleElement = errorAlertElement.querySelector(`.error__title`);
  const errorButtonElement = errorAlertElement.querySelector(`.error__button`);

  const renderAlert = (text) => {
    const main = document.querySelector(`main`);

    const alertElement = document.createElement(`div`);
    const alertText = document.createElement(`p`);

    alertElement.style = `position: absolute; z-index: 5; top: 0; left: 0; right: 0; background-color: red; display: flex; justify-content: center; align-items: center`;
    alertText.style = `color: white`;
    alertText.textContent = text;

    alertElement.appendChild(alertText);
    main.appendChild(alertElement);
  };

  const successButtonClickHandler = () => {
    closeSuccessWindow();
  };

  const successEscapeHandler = (evt) => {
    window.utils.isEscapeEvent(evt, closeSuccessWindow);
  };

  const successOutclickHandler = (evt) => {
    window.utils.isElementOutclicked(evt, successAlertElement, closeSuccessWindow);
  };

  const closeSuccessWindow = () => {
    mainElement.removeChild(successAlertElement);
    successButtonElement.removeEventListener(`click`, successButtonClickHandler);
    document.removeEventListener(`keydown`, successEscapeHandler);
    document.removeEventListener(`click`, successOutclickHandler);
  };

  const renderSuccessAlert = () => {
    mainElement.appendChild(successAlertElement);

    successButtonElement.addEventListener(`click`, successButtonClickHandler);
    document.addEventListener(`keydown`, successEscapeHandler);
    document.addEventListener(`click`, successOutclickHandler);
  };

  const errorButtonClickHandler = () => {
    closeErrorWindow();
  };

  const errorEscapeHandler = (evt) => {
    window.utils.isEscapeEvent(evt, closeErrorWindow);
  };

  const errorOutclickHandler = (evt) => {
    window.utils.isElementOutclicked(evt, errorAlertElement, closeErrorWindow);
  };

  const closeErrorWindow = () => {
    mainElement.removeChild(errorAlertElement);
    errorButtonElement.removeEventListener(`click`, errorButtonClickHandler);
    document.removeEventListener(`keydown`, errorEscapeHandler);
    document.removeEventListener(`click`, errorOutclickHandler);
  };

  const renderErrorAlert = (text) => {
    errorTitleElement.textContent = text;
    mainElement.appendChild(errorAlertElement);

    errorButtonElement.addEventListener(`click`, errorButtonClickHandler);
    document.addEventListener(`keydown`, errorEscapeHandler);
    document.addEventListener(`click`, errorOutclickHandler);
  };

  window.alert = {
    renderAlert,
    renderSuccessAlert,
    renderErrorAlert
  };
})();
