'use strict';

(() => {
  const TIMEOUT = 10000;

  const handleRequest = (xhr, successHandler, errorHandler, timeout) => {
    xhr.responseType = `json`;

    xhr.addEventListener(`load`, () => {
      let error;
      switch (xhr.status) {
        case 200:
          successHandler(xhr.response);
          break;

        case 400:
          error = `Неверный запрос`;
          break;

        case 401:
          error = `Пользователь не авторизован`;
          break;

        case 404:
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

  window.backend = {
    loadPhotos
  };
})();
