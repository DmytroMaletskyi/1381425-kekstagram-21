'use strict';

const getRandomIndex = (arrayLength) => {
  return Math.floor(Math.random() * arrayLength);
};

const getRandomInt = (min = 15, max = 200) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isEscapeEvent = (evt, action) => {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    action();
  }
};

const isElementOutClicked = (evt, element, action) => {
  if (evt.target === element) {
    action();
  }
};

const higlightElement = (element, color) => {
  element.style = `outline: ${color}; box-shadow: 0 0 0 3px ${color}`;
};

const resetElementStyles = (element) => {
  element.style = null;
};

const removeAllEventListeners = (element) => {
  element.replaceWith(element.cloneNode(true));
};

window.utils = {
  getRandomIndex,
  getRandomInt,
  isEscapeEvent,
  isElementOutClicked,
  higlightElement,
  resetElementStyles,
  removeAllEventListeners
};
