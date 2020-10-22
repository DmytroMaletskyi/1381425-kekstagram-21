'use strict';

(() => {
  let DEBOUNCE_INTERVAL = 500;

  window.debounce = (cb) => {
    let lastTimeout = null;

    return (data) => {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(() => {
        cb(data);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();
