export const getRandomBool = () => Math.random() >= 0.5;
export const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));
export const getRandomElement = (arrayElements) => arrayElements[getRandomNumber(arrayElements.length - 1)];

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
