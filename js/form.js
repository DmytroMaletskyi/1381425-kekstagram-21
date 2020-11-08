'use strict';

const OUTLINE_COLOR = `rgba(255, 0, 0, .5)`;
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
const imageUploadFormElement = document.querySelector(`.img-upload__form`);
const imageLoaderElement = imageUploadFormElement.querySelector(`#upload-file`);
const loaderCloseButtonElement = imageUploadFormElement.querySelector(`#upload-cancel`);
const imageEditorElement = imageUploadFormElement.querySelector(`.img-upload__overlay`);
const imagePreviewElement = imageEditorElement.querySelector(`.img-upload__preview img`);
const scaleDecreaseButtonElement = imageEditorElement.querySelector(`.scale__control--smaller`);
const scaleIncreaseButtonElement = imageEditorElement.querySelector(`.scale__control--bigger`);
const scaleValueElement = imageEditorElement.querySelector(`.scale__control--value`);
const effectsListElement = imageEditorElement.querySelector(`.effects__list`);
const originalEffectElement = effectsListElement.querySelector(`#effect-none`);
const effectLevelSliderElement = imageEditorElement.querySelector(`.img-upload__effect-level`);
const effectLevelInputElement = effectLevelSliderElement.querySelector(`.effect-level__value`);
const effectLevelPinElement = effectLevelSliderElement.querySelector(`.effect-level__pin`);
const effectLevelDepthElement = effectLevelSliderElement.querySelector(`.effect-level__depth`);
const hashTagInputElement = imageEditorElement.querySelector(`.text__hashtags`);
const commentsFieldElement = imageEditorElement.querySelector(`.text__description`);

const loadModalOpenHandler = (evt) => {
  imageEditorElement.classList.remove(`hidden`);
  body.classList.add(`modal-open`);

  scaleValue = DEFAULT_SCALE;
  setScale(scaleValue);
  imagePreviewElement.src = URL.createObjectURL(evt.target.files[0]);
  effectLevelSliderElement.classList.add(`hidden`);
  originalEffectElement.checked = true;
  resetPreviewEffectClasses();

  loaderCloseButtonElement.addEventListener(`click`, loadModalCloseHandler);
  scaleDecreaseButtonElement.addEventListener(`click`, scaleDecreaseClickHandler);
  scaleIncreaseButtonElement.addEventListener(`click`, scaleIncreaseClickHandler);
  effectsListElement.addEventListener(`change`, effectsListClickHandler);
  effectLevelPinElement.addEventListener(`mousedown`, window.slider.pinMouseDownHandler);
  hashTagInputElement.addEventListener(`input`, hashTagInputHandler);
  imageUploadFormElement.addEventListener(`submit`, imageSubmitHandler);
  document.addEventListener(`keydown`, modalEscapeHandler);
};

const loadModalCloseHandler = () => {
  imageEditorElement.classList.add(`hidden`);
  body.classList.remove(`modal-open`);

  imageLoaderElement.value = ``;
  window.utils.resetElementStyles(hashTagInputElement);

  loaderCloseButtonElement.removeEventListener(`click`, loadModalCloseHandler);
  scaleDecreaseButtonElement.removeEventListener(`click`, scaleDecreaseClickHandler);
  scaleIncreaseButtonElement.removeEventListener(`click`, scaleIncreaseClickHandler);
  effectsListElement.removeEventListener(`change`, effectsListClickHandler);
  effectLevelPinElement.removeEventListener(`mousedown`, window.slider.pinMouseDownHandler);
  hashTagInputElement.removeEventListener(`input`, hashTagInputHandler);
  imageUploadFormElement.removeEventListener(`submit`, imageSubmitHandler);
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
    window.utils.higlightElement(hashTagInputElement, OUTLINE_COLOR);
  } else if (!checkHashTagsValidity(hashTags)) {
    hashTagInputElement.setCustomValidity(`Хэштег должен начинаться с символа #, может включать только буквы и цифры, а также не превышать 20 символов в длину`);
    window.utils.higlightElement(hashTagInputElement, OUTLINE_COLOR);
  } else if (!checkHashTagsDuplication(hashTags)) {
    hashTagInputElement.setCustomValidity(`Хэштеги не должны повторяться`);
    window.utils.higlightElement(hashTagInputElement, OUTLINE_COLOR);
  } else {
    hashTagInputElement.setCustomValidity(``);
  }

  hashTagInputElement.reportValidity();
};

const modalEscapeHandler = (evt) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    if (hashTagInputElement !== document.activeElement && commentsFieldElement !== document.activeElement) {
      loadModalCloseHandler();
    }
  }
};

const resetFormFields = () => {
  hashTagInputElement.value = ``;
  commentsFieldElement.value = ``;
};

const successfulUploadHandler = () => {
  loadModalCloseHandler();
  resetFormFields();
  window.alert.renderSuccessAlert();
};

const failedUploadHandler = (errorText) => {
  loadModalCloseHandler();
  resetFormFields();
  window.alert.renderErrorAlert(errorText);
};

const imageSubmitHandler = (evt) => {
  window.backend.uploadPhoto(new FormData(imageUploadFormElement), successfulUploadHandler, failedUploadHandler);
  evt.preventDefault();
};

imageLoaderElement.addEventListener(`change`, loadModalOpenHandler);

window.form = {
  setEffectLevel
};
