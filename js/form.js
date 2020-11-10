'use strict';

const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
const OUTLINE_COLOR = `rgba(255, 0, 0, .5)`;
const DEFAULT_SCALE = 100;
const DEFAULT_EFFECT_LEVEL = 100;
const HASH_TAG_PATTERN = /^#[A-Za-z0-9]{1,19}$/;
const HASH_TAG_MAX = 5;
const EFFECTS = {
  'effects__preview--chrome': (effectLevel) => {
    return `grayscale(${effectLevel / 100})`;
  },
  'effects__preview--sepia': (effectLevel) => {
    return `sepia(${effectLevel / 100})`;
  },
  'effects__preview--marvin': (effectLevel) => {
    return `invert(${effectLevel}%)`;
  },
  'effects__preview--phobos': (effectLevel) => {
    return `blur(${effectLevel * 3 / 100}px)`;
  },
  'effects__preview--heat': (effectLevel) => {
    return `brightness(${effectLevel * 2 / 100 + 1})`;
  }
};

let scaleValue = DEFAULT_SCALE;
let effectLevel = DEFAULT_EFFECT_LEVEL;
let currentEffect = ``;

const bodyElement = document.querySelector(`body`);
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

const checkLoadedFile = (file) => {
  const fileName = file.name.toLowerCase();

  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const setPhotoPreview = (file) => {
  const reader = new FileReader();

  reader.addEventListener(`load`, () => {
    imagePreviewElement.src = reader.result;
  });

  reader.readAsDataURL(file);
};

const loadModalOpenHandler = (evt) => {
  const file = evt.target.files[0];
  if (checkLoadedFile(file)) {
    imageEditorElement.classList.remove(`hidden`);
    bodyElement.classList.add(`modal-open`);
    setPhotoPreview(file);

    scaleValue = DEFAULT_SCALE;
    setScale(scaleValue);
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
  } else {
    window.alert.renderAlert(`Неправильный формат изображения!`);
    imageUploadFormElement.reset();
  }
};

const loadModalCloseHandler = () => {
  imageEditorElement.classList.add(`hidden`);
  bodyElement.classList.remove(`modal-open`);

  imageUploadFormElement.reset();
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

const checkHashTagsAmount = (hashTags) => {
  return ((hashTags.length <= HASH_TAG_MAX) ? true : false);
};

const checkHashTagsValidity = (hashTags) => {
  for (let hashTag of hashTags) {
    if (!HASH_TAG_PATTERN.test(hashTag)) {
      return false;
    }
  }

  return true;
};

const countRepetitionsInArray = (array, targetItem) => {
  return array.filter((arrayItem) => {
    return arrayItem.toLowerCase() === targetItem;
  }
  ).length;
};

const checkHashTagsDuplication = (hashTags) => {
  for (let hashTag of hashTags) {
    if (countRepetitionsInArray(hashTags, hashTag.toLowerCase()) > 1) {
      return false;
    }
  }

  return true;
};

const hashTagInputHandler = () => {
  const hashTags = hashTagInputElement.value.split(` `);

  if (hashTagInputElement.value.length === 0) {
    hashTagInputElement.setCustomValidity(``);
    window.utils.resetElementStyles(hashTagInputElement);
  } else if (!checkHashTagsAmount(hashTags)) {
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
    window.utils.resetElementStyles(hashTagInputElement);
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
