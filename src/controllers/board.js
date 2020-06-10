// components
import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";
// controllers
import TaskController, {EmptyTask, Mode as TaskControllerMode} from "./task";
// utils
import {remove, render, RenderPosition} from "../utils/render";

const FIRST_SHOW_TASKS_COUNT = 8;
const ON_BUTTON_CLICK_TASKS_COUNT = 8;

const renderTasks = (taskListElement, tasks, dataChangeHandler, viewChangeHandler) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, dataChangeHandler, viewChangeHandler);
    taskController.render(task, TaskControllerMode.DEFAULT);
    return taskController;
  });
};

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

export default class BoardController {
  constructor(container, tasksModel, api) {
    this._container = container;
    this._tasksModel = tasksModel;
    this._api = api;

    this._showingTaskControllers = [];
    this._showingTasksCount = FIRST_SHOW_TASKS_COUNT;
    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._loadMoreButtonClickHandler = this._loadMoreButtonClickHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._tasksModel.setFilterChangeHandler(this._filterChangeHandler);
  }

  _loadMoreButtonClickHandler() {
    const prevTasksCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    this._showingTasksCount += ON_BUTTON_CLICK_TASKS_COUNT;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
    this._renderTasks(sortedTasks);

    if (this._showingTasksCount >= sortedTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    const loadMoreButtonComponent = this._loadMoreButtonComponent;
    remove(loadMoreButtonComponent);
    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const containerElement = this._container.getElement();
    render(containerElement, loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(this._loadMoreButtonClickHandler);
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._dataChangeHandler, this._viewChangeHandler);
    this._showingTaskControllers = this._showingTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showingTaskControllers.length;
  }

  _sortTypeChangeHandler(sortType) {
    const oldShowingTasksCount = this._showingTasksCount;
    this._showingTasksCount = FIRST_SHOW_TASKS_COUNT;
    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    if (oldShowingTasksCount >= this._tasksModel.getTasks().length) {
      this._renderLoadMoreButton();
    }
  }

  _dataChangeHandler(taskController, oldTask, newTask) {
    if (oldTask === EmptyTask) {
      this._creatingTask = null;
      if (newTask === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newTask);
        taskController.render(newTask, TaskControllerMode.DEFAULT);

        if (this._showingTasksCount % FIRST_SHOW_TASKS_COUNT === 0) {
          const destroyedTask = this._showingTaskControllers.pop();
          destroyedTask.destroy();
        }

        this._showingTaskControllers = [].concat(taskController, this._showingTaskControllers);
        this._showingTasksCount = this._showingTaskControllers.length;

        this._renderLoadMoreButton();
      }
    } else if (newTask === null) {
      this._tasksModel.removeTask(oldTask.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      this._api.updateTask(oldTask.id, newTask)
        .then((taskModel) => {
          const isSuccess = this._tasksModel.updateTask(oldTask.id, taskModel);
          if (isSuccess) {
            taskController.render(taskModel, TaskControllerMode.DEFAULT);
            this._updateTasks(this._showingTasksCount);
          }
        });
    }
  }

  _viewChangeHandler() {
    this._showingTaskControllers.forEach((it) => it.setDefaultView());
  }

  _removeTasks() {
    this._showingTaskControllers.forEach((taskController) => taskController.destroy());
    this._showingTaskControllers = [];
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _filterChangeHandler() {
    this._updateTasks(FIRST_SHOW_TASKS_COUNT);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._dataChangeHandler, this._viewChangeHandler);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  hide() {
    if (this._container.getElement()) {
      this._container.hide();
    }
  }

  show() {
    if (this._container.getElement()) {
      this._container.show();
    }
  }

  setDefaultSort() {
    this._sortComponent.setDefaultSortType();
    this._sortTypeChangeHandler(SortType.DEFAULT);
  }

  render() {
    const tasks = this._tasksModel.getTasks();
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchived);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }
}
