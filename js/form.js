'use strict';

(() => {
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
    effectLevelPinElement.addEventListener(`mouseup`, effectPinMoveHandler);
    hashTagInputElement.addEventListener(`input`, hashTagInputHandler);
    document.addEventListener(`keydown`, modalEscapeHandler);
  };

  const loadModalCloseHandler = () => {
    imageEditorElement.classList.add(`hidden`);
    body.classList.remove(`modal-open`);

    imageLoaderElement.value = ``;

    loaderCloseButtonElement.removeEventListener(`click`, loadModalCloseHandler);
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
      if (hashTagInputElement !== document.activeElement && commentsFieldElement !== document.activeElement) {
        loadModalCloseHandler();
      }
    }
  };

  imageLoaderElement.addEventListener(`change`, loadModalOpenHandler);
})();
