'use strict';

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

const loadPhotos = (successHandler, errorHandler) => {
  const URL = `https://21.javascript.pages.academy/kekstagram/data`;

  const xhr = new XMLHttpRequest();

  handleRequest(xhr, successHandler, errorHandler, TIMEOUT);

  xhr.open(`GET`, URL);

  xhr.send();
};

const uploadPhoto = (data, successHandler, errorHandler) => {
  const URL = `https://21.javascript.pages.academy/kekstagram`;

  const xhr = new XMLHttpRequest();

  handleRequest(xhr, successHandler, errorHandler, TIMEOUT);

  xhr.open(`POST`, URL);

  xhr.send(data);
};

window.backend = {
  loadPhotos,

  uploadPhoto
};
