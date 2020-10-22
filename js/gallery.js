'use strict';

(() => {
  const picturesListElement = document.querySelector(`.pictures`);

  const renderPicturesList = (picturesList) => {
    while (picturesListElement.children.length > 2) {
      picturesListElement.removeChild(picturesListElement.lastChild);
    }

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
