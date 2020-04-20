const getRandomBool = () => Math.random() >= 0.5;
const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));
const getRandomElement = (arrayElements) => arrayElements[getRandomNumber(arrayElements.length - 1)];

export {getRandomBool, getRandomNumber, getRandomElement};
