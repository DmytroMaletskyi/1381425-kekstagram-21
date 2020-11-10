'use strict';

const DOWNLOAD_URL = `https://21.javascript.pages.academy/kekstagram/data`;
const UPLOAD_URL = `https://21.javascript.pages.academy/kekstagram`;
const TIMEOUT = 10000;
const RESPONSE_CODES = {
  'OK': 200,
  'Bad Request': 400,
  'Unauthorized': 401,
  'Not Found': 404
};

const handleRequest = (xhr, successHandler, errorHandler, timeout) => {
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, () => {
    let error;
    switch (xhr.status) {
      case RESPONSE_CODES[`OK`]:
        successHandler(xhr.response);
        break;

      case RESPONSE_CODES[`Bad Request`]:
        error = `Неверный запрос`;
        break;

      case RESPONSE_CODES[`Unauthorized`]:
        error = `Пользователь не авторизован`;
        break;

      case RESPONSE_CODES[`Not Found`]:
        error = `Ничего не найдено`;
        break;

      default:
        error = `Статус ответа: ${xhr.status} ${xhr.statusText}`;
    }

    if (error) {
      errorHandler(error);
    }
  });


  xhr.addEventListener(`error`, () => {
    errorHandler(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, () => {
    errorHandler(`Запрос не успел выполниться за ${timeout}мс`);
  });

  xhr.timeout = timeout;
};

const prepareXhrRequest = (url, method, successHandler, errorHandler, timeout) => {
  const xhr = new XMLHttpRequest();

  handleRequest(xhr, successHandler, errorHandler, timeout);

  xhr.open(method, url);

  return xhr;
};

const loadPhotos = (successHandler, errorHandler) => {
  // const url = `https://21.javascript.pages.academy/kekstagram/data`;

  // const xhr = new XMLHttpRequest();

  // handleRequest(xhr, successHandler, errorHandler, TIMEOUT);

  // xhr.open(`GET`, url);
  const xhr = prepareXhrRequest(DOWNLOAD_URL, `GET`, successHandler, errorHandler, TIMEOUT);

  xhr.send();
};

const uploadPhoto = (photoData, successHandler, errorHandler) => {
  // const url = `https://21.javascript.pages.academy/kekstagram`;

  // const xhr = new XMLHttpRequest();

  // handleRequest(xhr, successHandler, errorHandler, TIMEOUT);

  // xhr.open(`POST`, url);
  const xhr = prepareXhrRequest(UPLOAD_URL, `POST`, successHandler, errorHandler, TIMEOUT);

  xhr.send(photoData);
};

window.backend = {
  loadPhotos,

  uploadPhoto
};
