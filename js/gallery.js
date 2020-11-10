'use strict';

const picturesListElement = document.querySelector(`.pictures`);

const renderPicturesList = (picturesList) => {
  while (picturesListElement.children.length > 2) {
    picturesListElement.removeChild(picturesListElement.lastChild);
  }

  const fragment = document.createDocumentFragment();

  picturesList.forEach((picture) => {
    fragment.appendChild(window.picture.renderElement(picture));
  });

  picturesListElement.appendChild(fragment);
};

window.gallery = {
  renderPicturesList
};
