'use strict';

const filtersElement = document.querySelector(`.img-filters`);
const filtersFormElement = filtersElement.querySelector(`.img-filters__form`);


const successLoadHandler = (data) => {
  window.loadedData = data;
  window.gallery.renderPicturesList(data);
  filtersFormElement.addEventListener(`click`, window.filters.filtersClickHandler);
  filtersElement.classList.remove(`img-filters--inactive`);
};

window.backend.loadPhotos(successLoadHandler, window.alert.renderAlert);

