'use strict';

const FILTERS = {
  'default': `filter-default`,
  'random': `filter-random`,
  'discussed': `filter-discussed`
};

const filtersFormElement = document.querySelector(`.img-filters__form`);

let currentFilterIndex = 0;

const prepareRandomPhotosList = () => {
  const clonedLoadedPicturesData = JSON.parse(JSON.stringify(window.loadedPicturesData));
  const randomPhotosList = [];
  for (let i = 0; i < 10; i++) {
    randomPhotosList.push(clonedLoadedPicturesData.splice(window.utils.getRandomIndex(clonedLoadedPicturesData.length), 1)[0]);
  }

  return randomPhotosList;
};

const prepareSortedPhotosList = () => {
  const clonedLoadedPicturesData = JSON.parse(JSON.stringify(window.loadedPicturesData));
  return clonedLoadedPicturesData.sort((next, prev) => prev.comments.length - next.comments.length);
};

const renderFilter = (targetId) => {
  switch (targetId) {
    case FILTERS[`default`]:
      window.gallery.renderPicturesList(window.loadedPicturesData);
      break;

    case FILTERS[`random`]:
      window.gallery.renderPicturesList(prepareRandomPhotosList());
      break;

    case FILTERS[`discussed`]:
      window.gallery.renderPicturesList(prepareSortedPhotosList());
      break;
  }
};

const applyFilter = window.debounce(renderFilter);

const clickHandler = (evt) => {
  filtersFormElement.children[currentFilterIndex].classList.remove(`img-filters__button--active`);
  evt.target.classList.add(`img-filters__button--active`);
  currentFilterIndex = Array.from(evt.target.parentNode.children).indexOf(evt.target);
  applyFilter(evt.target.id);
};

window.filters = {
  clickHandler
};
