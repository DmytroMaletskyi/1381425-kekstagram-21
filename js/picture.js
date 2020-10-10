'use strict';

(() => {
  const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);

  const renderPictureElement = (picture) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector(`.picture__img`).src = picture.url;
    pictureElement.querySelector(`.picture__likes`).textContent = picture.likes;
    pictureElement.querySelector(`.picture__comments`).textContent = picture.comments.length;

    pictureElement.addEventListener(`click`, window.preview.onPreviewClickHandler.bind(null, picture));

    return pictureElement;
  };

  window.picture = {
    renderPictureElement
  };
})();
