const path = require("path");

module.exports = {
  entry: [
    "./js/utils.js",
    "./js/debounce.js",
    "./js/alert.js",
    "./js/filter.js",
    "./js/backend.js",
    "./js/picture.js",
    "./js/gallery.js",
    "./js/preview.js",
    "./js/slider.js",
    "./js/form.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
