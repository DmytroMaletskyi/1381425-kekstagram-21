'use strict';

const body = document.querySelector(`body`);
const pictureDetailsElement = document.querySelector(`.big-picture`);
const bigPictureCancelButtonElement = pictureDetailsElement.querySelector(`.big-picture__cancel`);
const bigPictureElement = pictureDetailsElement.querySelector(`.big-picture__img img`);
const fullSizeLikesCounterElement = pictureDetailsElement.querySelector(`.likes-count`);
const fullSizeCommentsCounterElement = pictureDetailsElement.querySelector(`.comments-count`);
const fullSizeDisplayedCommentsCounterElement = pictureDetailsElement.querySelector(`.displayed-comments`);
const fullSizeCommentsListElement = pictureDetailsElement.querySelector(`.social__comments`);
const fullSizePictureCaptionElement = pictureDetailsElement.querySelector(`.social__caption`);
let commentsLoaderButtonElement = pictureDetailsElement.querySelector(`.comments-loader`);

const cleanCommentsList = () => {
  fullSizeCommentsListElement.innerHTML = ``;
};

const renderPictureComment = (comment) => {
  const commentElement = document.createElement(`li`);
  const commentAvatar = document.createElement(`img`);
  const commentText = document.createElement(`p`);

  commentAvatar.classList.add(`social__picture`);
  commentAvatar.src = comment.avatar;
  commentAvatar.alt = comment.name;
  commentAvatar.width = `35`;
  commentAvatar.height = `35`;

  commentText.classList.add(`social__text`);
  commentText.textContent = comment.message;

  commentElement.classList.add(`social__comment`);
  commentElement.appendChild(commentAvatar);
  commentElement.appendChild(commentText);

  return commentElement;
};

const setDisplayedCommentsAmount = () => {
  fullSizeDisplayedCommentsCounterElement.textContent = fullSizeCommentsListElement.children.length;
};

const appendMoreComments = (commentsList) => {
  const fragment = document.createDocumentFragment();

  if (commentsList.length <= 5) {
    for (let comment of commentsList) {
      fragment.appendChild(renderPictureComment(comment));
      commentsLoaderButtonElement.classList.add(`hidden`);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      fragment.appendChild(renderPictureComment(commentsList.shift()));
    }
  }

  fullSizeCommentsListElement.appendChild(fragment);
  setDisplayedCommentsAmount();
};

const onLoadCommentsClickHandler = (commentsList) => {
  appendMoreComments(commentsList);
};

const renderCommentsList = (commentsList) => {
  cleanCommentsList();

  if (commentsLoaderButtonElement.classList.contains(`hidden`)) {
    commentsLoaderButtonElement.classList.remove(`hidden`);
  }

  window.utils.removeAllEventListeners(commentsLoaderButtonElement);
  commentsLoaderButtonElement = pictureDetailsElement.querySelector(`.comments-loader`);

  commentsLoaderButtonElement.addEventListener(`click`, onLoadCommentsClickHandler.bind(null, commentsList));
  appendMoreComments(commentsList);
};

const renderPictureDetailsElement = (picture) => {
  picture.notDisplayedComments = JSON.parse(JSON.stringify(picture.comments));
  bigPictureElement.src = picture.url;
  fullSizeLikesCounterElement.textContent = picture.likes;
  fullSizeCommentsCounterElement.textContent = picture.comments.length;
  renderCommentsList(picture.notDisplayedComments);
  fullSizePictureCaptionElement.textContent = picture.description;
};

const closePreviewWindow = () => {
  body.classList.remove(`modal-open`);
  pictureDetailsElement.classList.add(`hidden`);

  bigPictureCancelButtonElement.removeEventListener(`click`, closePreviewWindow);
  document.removeEventListener(`keydown`, previewEscapeHandler);
};

const previewEscapeHandler = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closePreviewWindow();
  }
};

const onPreviewClickHandler = (picture) => {
  renderPictureDetailsElement(picture);
  body.classList.add(`modal-open`);
  pictureDetailsElement.classList.remove(`hidden`);

  bigPictureCancelButtonElement.addEventListener(`click`, closePreviewWindow);
  document.addEventListener(`keydown`, previewEscapeHandler);
};

window.preview = {
  renderPictureDetailsElement,

  onPreviewClickHandler
};
