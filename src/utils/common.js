import moment from "moment";

export const getRandomBool = () => Math.random() >= 0.5;
export const getRandomNumber = (end, start = 0) => Math.floor(start + Math.random() * (end + 1 - start));
export const getRandomElement = (arrayElements) => arrayElements[getRandomNumber(arrayElements.length - 1)];
export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};
export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};
export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};
export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(dueDate, date);
};
export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};
export const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};
