'use strict';

const COMMENTS = [`Всё отлично!`, `В целом всё неплохо. Но не всё.`, `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`, `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`, `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`, `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`];
const NAMES = [`Саша`, `Маша`, `Даша`, `Паша`, `Коля`, `Оля`, `Алексей`];
const DEFAULT_SCALE = 100;
const DEFAULT_EFFECT_LEVEL = 100;
const HASH_TAG_PATTERN = /^#[A-Za-z0-9]{1,19}$/;
const HASH_TAG_MAX = 5;
const EFFECTS = {
  'effects__preview--chrome': (effectLevel) => `grayscale(${effectLevel / 100})`,
  'effects__preview--sepia': (effectLevel) => `sepia(${effectLevel / 100})`,
  'effects__preview--marvin': (effectLevel) => `invert(${effectLevel}%)`,
  'effects__preview--phobos': (effectLevel) => `blur(${effectLevel * 3 / 100}px)`,
  'effects__preview--heat': (effectLevel) => `brightness(${effectLevel * 2 / 100 + 1})`
};

let scaleValue = DEFAULT_SCALE;
let effectLevel = DEFAULT_EFFECT_LEVEL;
let currentEffect = ``;

const body = document.querySelector(`body`);
const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
const picturesListElement = document.querySelector(`.pictures`);

// Full size picture elements
// const pictureDetailsElement = document.querySelector(`.big-picture`);
// const bigPictureElement = pictureDetailsElement.querySelector(`.big-picture__img img`);
// const fullSizeLikesCounter = pictureDetailsElement.querySelector(`.likes-count`);
// const displayedCommentsCounter = pictureDetailsElement.querySelector(`.social__comment-count`);
// const fullSizeCommentsCounter = pictureDetailsElement.querySelector(`.comments-count`);
// const fullSizeCommentsList = pictureDetailsElement.querySelector(`.social__comments`);
// const commentsLoader = pictureDetailsElement.querySelector(`.comments-loader`);
// const fullSizePictureCaption = pictureDetailsElement.querySelector(`.social__caption`);

// Image loading elements
const imageLoaderElement = document.querySelector(`#upload-file`);
const loaderCloseButtonElement = document.querySelector(`#upload-cancel`);
const imageEditorElement = document.querySelector(`.img-upload__overlay`);
const imagePreviewElement = imageEditorElement.querySelector(`.img-upload__preview img`);
const scaleDecreaseButtonElement = imageEditorElement.querySelector(`.scale__control--smaller`);
const scaleIncreaseButtonElement = imageEditorElement.querySelector(`.scale__control--bigger`);
const scaleValueElement = imageEditorElement.querySelector(`.scale__control--value`);
const effectsListElement = imageEditorElement.querySelector(`.effects__list`);
const originalEffectElement = effectsListElement.querySelector(`#effect-none`);
const effectLevelSliderElement = imageEditorElement.querySelector(`.img-upload__effect-level`);
const effectLevelBarElement = effectLevelSliderElement.querySelector(`.effect-level__line`);
const effectLevelInputElement = effectLevelSliderElement.querySelector(`.effect-level__value`);
const effectLevelPinElement = effectLevelSliderElement.querySelector(`.effect-level__pin`);
const effectLevelDepthElement = effectLevelSliderElement.querySelector(`.effect-level__depth`);
const hashTagInputElement = imageEditorElement.querySelector(`.text__hashtags`);

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
// const cleanCommentsList = () => {
//   while (fullSizeCommentsList.firstChild) {
//     fullSizeCommentsList.removeChild(fullSizeCommentsList.firstChild);
//   }
// };

// const renderPictureComment = (comment) => {
//   const commentElement = document.createElement(`li`);
//   const commentAvatar = document.createElement(`img`);
//   const commentText = document.createElement(`p`);

//   commentAvatar.classList.add(`social__picture`);
//   commentAvatar.src = comment.avatar;
//   commentAvatar.alt = comment.name;
//   commentAvatar.width = `35`;
//   commentAvatar.height = `35`;

//   commentText.classList.add(`social__text`);
//   commentText.textContent = comment.message;

//   commentElement.classList.add(`social__comment`);
//   commentElement.appendChild(commentAvatar);
//   commentElement.appendChild(commentText);

//   return commentElement;
// };

// const renderCommentsList = (commentsList) => {
//   cleanCommentsList();
//   const fragment = document.createDocumentFragment();

//   for (let comment of commentsList) {
//     fragment.appendChild(renderPictureComment(comment));
//   }

//   fullSizeCommentsList.appendChild(fragment);
// };

// const renderPictureDetailsElement = (picture) => {
//   bigPictureElement.src = picture.url;
//   fullSizeLikesCounter.textContent = picture.likes;
//   fullSizeCommentsCounter.textContent = picture.comments.length;
//   renderCommentsList(picture.comments);
//   fullSizePictureCaption.textContent = picture.description;
// };

// Handlers

const loadModalOpenHandler = (evt) => {
  imageEditorElement.classList.remove(`hidden`);
  body.classList.add(`modal-open`);

  scaleValue = DEFAULT_SCALE;
  setScale(scaleValue);
  imagePreviewElement.src = URL.createObjectURL(evt.target.files[0]);
  effectLevelSliderElement.classList.add(`hidden`);
  originalEffectElement.checked = true;
  resetPreviewEffectClasses();

  scaleDecreaseButtonElement.addEventListener(`click`, scaleDecreaseClickHandler);
  scaleIncreaseButtonElement.addEventListener(`click`, scaleIncreaseClickHandler);
  effectsListElement.addEventListener(`change`, effectsListClickHandler);
  effectLevelPinElement.addEventListener(`mouseup`, effectPinMoveHandler);
  hashTagInputElement.addEventListener(`input`, hashTagInputHandler);
  document.addEventListener(`keydown`, modalEscapeHandler);
};

const loadModalCloseHandler = () => {
  imageEditorElement.classList.add(`hidden`);
  body.classList.remove(`modal-open`);

  imageLoaderElement.value = ``;

  scaleDecreaseButtonElement.removeEventListener(`click`, scaleDecreaseClickHandler);
  scaleIncreaseButtonElement.removeEventListener(`click`, scaleIncreaseClickHandler);
  effectsListElement.removeEventListener(`change`, effectsListClickHandler);
  effectLevelPinElement.removeEventListener(`mouseup`, effectPinMoveHandler);
  hashTagInputElement.removeEventListener(`input`, hashTagInputHandler);
  document.removeEventListener(`keydown`, modalEscapeHandler);
};

const setScale = (value) => {
  scaleValueElement.value = `${value}%`;
  imagePreviewElement.style.transform = `scale(${value / 100})`;
};

const scaleDecreaseClickHandler = () => {
  if (scaleValue > 25) {
    scaleValue -= 25;
    setScale(scaleValue);
  }
};

const scaleIncreaseClickHandler = () => {
  if (scaleValue < 100) {
    scaleValue += 25;
    setScale(scaleValue);
  }
};

const setEffectLevel = (level) => {
  effectLevelInputElement.value = level;
  effectLevelPinElement.style.left = `${level}%`;
  effectLevelDepthElement.style.width = `${level}%`;
  imagePreviewElement.style.filter = EFFECTS[currentEffect](level);
};

const calculatePinPosition = (horizontalCoordinate) => {
  return ((horizontalCoordinate - effectLevelBarElement.offsetWidth) * 100 / effectLevelBarElement.offsetWidth).toFixed(0);
};

const effectPinMoveHandler = (evt) => {
  effectLevel = calculatePinPosition(evt.clientX);
  if (effectLevel > 100) {
    effectLevel = 100;
  } else if (effectLevel < 0) {
    effectLevel = 0;
  }
  setEffectLevel(effectLevel);
};

const resetPreviewEffectClasses = () => {
  if (currentEffect !== ``) {
    imagePreviewElement.style.filter = null;
    imagePreviewElement.classList.remove(currentEffect);
  }
};

const effectsListClickHandler = (evt) => {
  resetPreviewEffectClasses();

  if (evt.target.value !== `none`) {
    currentEffect = `effects__preview--${evt.target.value}`;
    imagePreviewElement.classList.add(currentEffect);
    effectLevel = DEFAULT_EFFECT_LEVEL;
    setEffectLevel(effectLevel);
  } else {
    currentEffect = ``;
  }

  if (currentEffect !== ``) {
    effectLevelSliderElement.classList.remove(`hidden`);
  } else {
    effectLevelSliderElement.classList.add(`hidden`);
  }
};

const checkHashTagsAmount = (hashTags) => ((hashTags.length <= HASH_TAG_MAX) ? true : false);

const checkHashTagsValidity = (hashTags) => {
  for (let hashTag of hashTags) {
    if (!HASH_TAG_PATTERN.test(hashTag)) {
      return false;
    }
  }

  return true;
};

const countInArray = (array, what) => {
  return array.filter((item) => item.toLowerCase() === what).length;
};

const checkHashTagsDuplication = (hashTags) => {
  for (let hashTag of hashTags) {
    if (countInArray(hashTags, hashTag.toLowerCase()) > 1) {
      return false;
    }
  }

  return true;
};

const hashTagInputHandler = () => {
  const hashTags = hashTagInputElement.value.split(` `);

  if (!checkHashTagsAmount(hashTags)) {
    hashTagInputElement.setCustomValidity(`Количество хэштегов не должно превышать ${HASH_TAG_MAX}. Пожалуйста, удалите ${hashTags.length - HASH_TAG_MAX}`);
  } else if (!checkHashTagsValidity(hashTags)) {
    hashTagInputElement.setCustomValidity(`Хэштег должен начинаться с символа #, может включать только буквы и цифры, а также не превышать 20 символов в длину`);
  } else if (!checkHashTagsDuplication(hashTags)) {
    hashTagInputElement.setCustomValidity(`Хэштеги не должны повторяться`);
  } else {
    hashTagInputElement.setCustomValidity(``);
  }

  hashTagInputElement.reportValidity();
};

const modalEscapeHandler = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    if (hashTagInputElement !== document.activeElement) {
      loadModalCloseHandler();
    }
  }
};

imageLoaderElement.addEventListener(`change`, loadModalOpenHandler);
loaderCloseButtonElement.addEventListener(`click`, loadModalCloseHandler);

const picturesList = createPicturesList(25);
renderPicturesList(picturesList);

// Дополнительное задание
/* pictureDetailsElement.classList.remove(`hidden`);
renderPictureDetailsElement(picturesList[0]);
displayedCommentsCounter.classList.add(`hidden`);
commentsLoader.classList.add(`hidden`);
body.classList.add(`modal-open`); */

