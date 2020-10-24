'use strict';

(() => {
  const filtersFormElement = document.querySelector(`.img-filters__form`);

  let currentFilterIndex = 0;

  const prepareRandomPhotosList = () => {
    const clonedLoadedData = JSON.parse(JSON.stringify(window.loadedData));
    const randomPhotosList = [];
    for (let i = 0; i < 10; i++) {
      randomPhotosList.push(clonedLoadedData.splice(window.utils.getRandomIndex(clonedLoadedData.length), 1)[0]);
    }

    return randomPhotosList;
  };

  const prepareSortedPhotosList = () => {
    const clonedLoadedData = JSON.parse(JSON.stringify(window.loadedData));
    const sortedList = clonedLoadedData.sort((next, prev) => prev.comments.length - next.comments.length);

    return sortedList;
  };

  const renderFilter = (targetId) => {
    switch (targetId) {
      case `filter-default`:
        window.gallery.renderPicturesList(window.loadedData);
        break;

      case `filter-random`:
        window.gallery.renderPicturesList(prepareRandomPhotosList());
        break;

      case `filter-discussed`:
        window.gallery.renderPicturesList(prepareSortedPhotosList());
        break;
    }
  };

  const applyFilter = window.debounce(renderFilter);

  const filtersClickHandler = (evt) => {
    filtersFormElement.children[currentFilterIndex].classList.remove(`img-filters__button--active`);
    evt.target.classList.add(`img-filters__button--active`);
    currentFilterIndex = Array.from(evt.target.parentNode.children).indexOf(evt.target);
    applyFilter(evt.target.id);
  };

  window.filters = {
    filtersClickHandler
  };
})();
