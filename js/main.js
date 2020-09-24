'use strict';

const COMMENTS = [`Всё отлично!`, `В целом всё неплохо. Но не всё.`, `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`, `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`, `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`, `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`];
const NAMES = [`Саша`, `Маша`, `Даша`, `Паша`, `Коля`, `Оля`, `Алексей`];

const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
const picturesListElement = document.querySelector(`.pictures`);

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

  for (let i = 0; i < picturesList.length; i++) {
    fragment.appendChild(renderPictureElement(picturesList[i]));
  }

  picturesListElement.appendChild(fragment);
};

const picturesList = createPicturesList(25);
renderPicturesList(picturesList);
