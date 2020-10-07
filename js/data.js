'use strict';

(() => {
  const COMMENTS = [`Всё отлично!`, `В целом всё неплохо. Но не всё.`, `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`, `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`, `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`, `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`];
  const NAMES = [`Саша`, `Маша`, `Даша`, `Паша`, `Коля`, `Оля`, `Алексей`];


  const generateComment = () => {
    const comment = {};

    comment.avatar = `img/avatar-${window.utils.getRandomInt(1, 6)}.svg`;
    comment.message = COMMENTS[window.utils.getRandomIndex(COMMENTS.length)];
    comment.name = NAMES[window.utils.getRandomIndex(NAMES.length)];

    return comment;
  };

  const generatePicture = (index) => {
    const picture = {};

    picture.url = `photos/${index}.jpg`;
    picture.description = `Photo ${index}`;
    picture.likes = window.utils.getRandomInt();
    picture.comments = [];

    for (let i = 0; i < window.utils.getRandomInt(1, 5); i++) {
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

  window.data = {
    createPicturesList
  };
})();
