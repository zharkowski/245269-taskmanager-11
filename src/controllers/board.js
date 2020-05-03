// components
import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";
// const
import {KEY} from "../const";

const FIRST_SHOW_TASKS_COUNT = 8;
const ON_BUTTON_CLICK_TASKS_COUNT = 8;

const renderTask = (tasksListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const escKeydownHandler = (evt) => {
    if (evt.key === KEY.ESC) {
      replace(taskComponent, taskEditComponent);
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };
  const editButtonClickHandler = () => {
    replace(taskEditComponent, taskComponent);
    document.addEventListener(`keydown`, escKeydownHandler);
  };
  const editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    replace(taskComponent, taskEditComponent);
    document.removeEventListener(`keydown`, escKeydownHandler);
  };

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);
  taskEditComponent.setEditFormSubmitHandler(editFormSubmitHandler);

  render(tasksListElement, taskComponent, RenderPosition.BEFOREEND);
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

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach(
      (task) => renderTask(taskListElement, task)
  );
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTaskComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingCardsCount >= tasks.length) {
        return;
      }

      const loadMoreButtonComponent = this._loadMoreButtonComponent;
      render(container, loadMoreButtonComponent, RenderPosition.BEFOREEND);
      loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingCardsCount;
        showingCardsCount += ON_BUTTON_CLICK_TASKS_COUNT;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingCardsCount);

        renderTasks(taskListElement, sortedTasks);

        if (showingCardsCount >= tasks.length) {
          remove(loadMoreButtonComponent);
          loadMoreButtonComponent.removeElement();
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = container.querySelector(`.board__tasks`);

    let showingCardsCount = FIRST_SHOW_TASKS_COUNT;
    renderTasks(taskListElement, tasks.slice(0, showingCardsCount));

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingCardsCount = FIRST_SHOW_TASKS_COUNT;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingCardsCount);

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks.slice(0, showingCardsCount));

      renderLoadMoreButton();
    });
  }
}
