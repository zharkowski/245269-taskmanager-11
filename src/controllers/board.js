// components
import NoTasksComponent from "../components/no-tasks";
import SortComponent from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
// utils
import {render, RENDER_POSITION} from "../utils/render";
// const
import {KEY} from "../const";

const FIRST_SHOW_TASKS_COUNT = 8;
const ON_BUTTON_CLICK_TASKS_COUNT = 8;

const renderTask = (tasksListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceEditToTask = () => {
    tasksListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    tasksListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const escKeydownHandler = (evt) => {
    if (evt.key === KEY.ESC) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };
  const editButtonClickHandler = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, escKeydownHandler);
  };
  const editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, escKeydownHandler);
  };

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);
  taskEditComponent.setEditFormSubmitHandler(editFormSubmitHandler);

  render(tasksListElement, taskComponent, RENDER_POSITION.BEFOREEND);
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
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTaskComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RENDER_POSITION.BEFOREEND);
    render(container, this._tasksComponent, RENDER_POSITION.BEFOREEND);

    const taskListElement = container.querySelector(`.board__tasks`);

    let showingCardsCount = FIRST_SHOW_TASKS_COUNT;
    tasks.slice(0, showingCardsCount).forEach(
        (task) => renderTask(taskListElement, task)
    );

    const loadMoreButtonComponent = this._loadMoreButtonComponent;
    render(container, loadMoreButtonComponent, RENDER_POSITION.BEFOREEND);
    loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingCardsCount;
      showingCardsCount += ON_BUTTON_CLICK_TASKS_COUNT;

      tasks.slice(prevTasksCount, showingCardsCount).forEach(
          (task) => renderTask(taskListElement, task)
      );

      if (showingCardsCount >= tasks.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
}
