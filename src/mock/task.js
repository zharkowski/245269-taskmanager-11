import {getRandomNumber, getRandomBool, getRandomElement} from '../../src/utils/common';
import {COLORS, MS_IN_WEEK, DESCRIPTIONS} from "../const";

const generateTask = () => {
  return {
    description: Math.random() >= 0.5 ? DESCRIPTIONS[Math.floor(Math.random() * 3)] : undefined,
    dueDate: Math.random() >= 0.5 ? new Date(Date.now() + getRandomNumber(MS_IN_WEEK, -MS_IN_WEEK)) : null,
    repeatingDays: Math.random() >= 0.5 ? {
      mo: getRandomBool(),
      tu: getRandomBool(),
      we: getRandomBool(),
      th: getRandomBool(),
      fr: getRandomBool(),
      sa: getRandomBool(),
      su: getRandomBool(),
    } : undefined,
    color: Math.random() >= 0.5 ? getRandomElement(COLORS) : undefined,
    isFavorite: getRandomBool(),
    isArchive: getRandomBool()
  };
};

const generateCards = (amount) => {
  return new Array(amount).fill(``).map(generateTask);
};

export default generateCards;