'use strict';

const COMMENTS = [`Всё отлично!`, `В целом всё неплохо. Но не всё.`, `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`, `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`, `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`, `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`];
const NAMES = [`Саша`, `Маша`, `Даша`, `Паша`, `Коля`, `Оля`, `Алексей`];

const body = document.querySelector(`body`);
const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
const picturesListElement = document.querySelector(`.pictures`);

// Full size picture elements
const pictureDetailsElement = document.querySelector(`.big-picture`);
const bigPictureElement = pictureDetailsElement.querySelector(`.big-picture__img img`);
const fullSizeLikesCounter = pictureDetailsElement.querySelector(`.likes-count`);
const displayedCommentsCounter = pictureDetailsElement.querySelector(`.social__comment-count`);
const fullSizeCommentsCounter = pictureDetailsElement.querySelector(`.comments-count`);
const fullSizeCommentsList = pictureDetailsElement.querySelector(`.social__comments`);
const commentsLoader = pictureDetailsElement.querySelector(`.comments-loader`);
const fullSizePictureCaption = pictureDetailsElement.querySelector(`.social__caption`);

// Random
const getRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);
const getRandomInt = (min = 15, max = 200) => Math.floor(Math.random() * (max - min + 1)) + min;

// Pictures generating
const generateComment = () => {
  const comment = {};

  comment.avatar = `img/avatar-${getRandomInt(1, 6)}.svg`;
  comment.message = COMMENTS[getRandomIndex(COMMENTS.length)];
  comment.name = NAMES[getRandomIndex(NAMES.length)];

  return comment;
};

const generatePicture = (index) => {
  const picture = {};

  picture.url = `photos/${index}.jpg`;
  picture.description = `Photo ${index}`;
  picture.likes = getRandomInt();
  picture.comments = [];

  for (let i = 0; i < getRandomInt(1, 5); i++) {
    picture.comments.push(generateComment());
  }

  return picture;
};

const createPicturesList = (picturesAmount = 25) => {
  const picturesList = [];

  for (let i = 1; i <= picturesAmount; i++) {
    picturesList.push(generatePicture(i));
  }

  return picturesList;
};

// Pictures rendering
const renderPictureElement = (picture) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector(`.picture__img`).src = picture.url;
  pictureElement.querySelector(`.picture__likes`).textContent = picture.likes;
  pictureElement.querySelector(`.picture__comments`).textContent = picture.comments.length;

  return pictureElement;
};

const renderPicturesList = (picturesList) => {
  const fragment = document.createDocumentFragment();

  for (let picture of picturesList) {
    fragment.appendChild(renderPictureElement(picture));
  }

  picturesListElement.appendChild(fragment);
};


// Full size
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

const picturesList = createPicturesList(25);
renderPicturesList(picturesList);
pictureDetailsElement.classList.remove(`hidden`);
renderPictureDetailsElement(picturesList[0]);
displayedCommentsCounter.classList.add(`hidden`);
commentsLoader.classList.add(`hidden`);
body.classList.add(`modal-open`);

