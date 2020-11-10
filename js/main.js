'use strict';

const filtersElement = document.querySelector(`.img-filters`);
const filtersFormElement = filtersElement.querySelector(`.img-filters__form`);


const successLoadHandler = (picturesData) => {
  window.loadedPicturesData = picturesData;
  window.gallery.renderPicturesList(picturesData);
  filtersFormElement.addEventListener(`click`, window.filters.filtersClickHandler);
  filtersElement.classList.remove(`img-filters--inactive`);
};

window.backend.loadPhotos(successLoadHandler, window.alertsRendering.renderAlert);

