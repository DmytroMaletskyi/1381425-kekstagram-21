'use strict';

(() => {
  const picturesListElement = document.querySelector(`.pictures`);

  const renderPicturesList = (picturesList) => {
    const fragment = document.createDocumentFragment();

    for (let picture of picturesList) {
      fragment.appendChild(window.picture.renderPictureElement(picture));
    }

    picturesListElement.appendChild(fragment);
  };

  window.gallery = {
    renderPicturesList
  };
})();
