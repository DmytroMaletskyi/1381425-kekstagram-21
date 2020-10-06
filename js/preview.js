'use strict';

(() => {
  const pictureDetailsElement = document.querySelector(`.big-picture`);
  const bigPictureElement = pictureDetailsElement.querySelector(`.big-picture__img img`);
  const fullSizeLikesCounter = pictureDetailsElement.querySelector(`.likes-count`);
  const fullSizeCommentsCounter = pictureDetailsElement.querySelector(`.comments-count`);
  const fullSizeCommentsList = pictureDetailsElement.querySelector(`.social__comments`);
  const fullSizePictureCaption = pictureDetailsElement.querySelector(`.social__caption`);

  const cleanCommentsList = () => {
      while (fullSizeCommentsList.firstChild) {
        fullSizeCommentsList.removeChild(fullSizeCommentsList.firstChild);
      }
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

  const renderCommentsList = (commentsList) => {
    cleanCommentsList();
    const fragment = document.createDocumentFragment();

    for (let comment of commentsList) {
      fragment.appendChild(renderPictureComment(comment));
    }

    fullSizeCommentsList.appendChild(fragment);
  };

  const renderPictureDetailsElement = (picture) => {
    bigPictureElement.src = picture.url;
    fullSizeLikesCounter.textContent = picture.likes;
    fullSizeCommentsCounter.textContent = picture.comments.length;
    renderCommentsList(picture.comments);
    fullSizePictureCaption.textContent = picture.description;
  };

  window.preview = {
    renderPictureDetailsElement
  };
})();
