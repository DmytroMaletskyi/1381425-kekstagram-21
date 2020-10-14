'use strict';

(() => {
  const getRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

  const getRandomInt = (min = 15, max = 200) => Math.floor(Math.random() * (max - min + 1)) + min;

  const isEscapeEvent = (evt, action) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      action();
    }
  };

  const isElementOutclicked = (evt, element, action) => {
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

  window.utils = {
    getRandomIndex,
    getRandomInt,
    isEscapeEvent,
    isElementOutclicked,
    higlightElement,
    resetElementStyles
  };
})();
