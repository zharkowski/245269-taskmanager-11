import {isOneDay, isOverdueDate, isRepeating} from "./common";
import {FilterType} from "../const";

const getArchiveTasks = (tasks) => tasks.filter((task) => task.isArchived);

const getNotArchiveTasks = (tasks) => tasks.filter((task) => !task.isArchived);

const getFavoriteTasks = (tasks) => tasks.filter((task) => task.isFavorite);

const getOverdueTasks = (tasks, date) => tasks.filter((task) => {
  const dueDate = task.dueDate;

  if (!dueDate) {
    return false;
  }

  return isOverdueDate(dueDate, date);
});

const getRepeatingTasks = (tasks) => tasks.filter((task) => isRepeating(task.repeatingDays));

const getTasksInOneDay = (tasks, date) => tasks.filter((task) => isOneDay(task.dueDate, date));

export const getTasksByFilter = (tasks, filterType) => {
  const nowDate = new Date();
  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(getNotArchiveTasks(tasks));
    case FilterType.OVERDUE:
      return getOverdueTasks(getNotArchiveTasks(tasks), nowDate);
    case FilterType.REPEATING:
      return getRepeatingTasks(getNotArchiveTasks(tasks));
    case FilterType.TODAY:
      return getTasksInOneDay(getNotArchiveTasks(tasks), nowDate);
  }
  return tasks;
};
