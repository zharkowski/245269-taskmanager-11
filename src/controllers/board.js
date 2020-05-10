// components
import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";
// utils
import {remove, render, RenderPosition} from "../utils/render";
import TaskController from "./task";

const FIRST_SHOW_TASKS_COUNT = 8;
const ON_BUTTON_CLICK_TASKS_COUNT = 8;

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

const renderTasks = (taskListElement, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = FIRST_SHOW_TASKS_COUNT;
    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const loadMoreButtonComponent = this._loadMoreButtonComponent;
    render(this._container.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

    const clickHandler = () => {
      const prevTasksCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount = prevTasksCount + ON_BUTTON_CLICK_TASKS_COUNT;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      const newTasks = renderTasks(taskListElement, sortedTasks);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        loadMoreButtonComponent.getElement().removeEventListener(`click`, clickHandler);
        remove(loadMoreButtonComponent);
      }
    };

    loadMoreButtonComponent.setClickHandler(clickHandler);
  }

  _sortTypeChangeHandler(sortType) {
    const oldShowingTasksCount = this._showingTasksCount;
    this._showingTasksCount = FIRST_SHOW_TASKS_COUNT;
    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;
    this._showedTaskControllers = renderTasks(taskListElement, sortedTasks.slice(0, this._showingTasksCount));

    if (oldShowingTasksCount >= this._tasks.length) {
      this._renderLoadMoreButton();
    }
  }

  render(tasks) {
    this._tasks = tasks;
    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    this._showingTasksCount = FIRST_SHOW_TASKS_COUNT;
    const newTasks = renderTasks(taskListElement, tasks.slice(0, this._showingTasksCount));
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }
}