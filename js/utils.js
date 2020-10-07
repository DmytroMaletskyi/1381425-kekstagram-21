'use strict';

(() => {
  const getRandomIndex = (arrayLength) => Math.floor(Math.random() * arrayLength);

  const getRandomInt = (min = 15, max = 200) => Math.floor(Math.random() * (max - min + 1)) + min;

  window.utils = {
    getRandomIndex,
    getRandomInt
  };
})();
