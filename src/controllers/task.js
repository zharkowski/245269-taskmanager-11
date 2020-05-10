import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {KEY} from "../const";
import {render, RenderPosition, replace} from "../utils/render";

export default class TaskController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    replace(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KEY.ESC) {
      replace(this._taskComponent, this._taskEditComponent);
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  render(task) {
    const taskComponent = new TaskComponent(task);
    const taskEditComponent = new TaskEditComponent(task);

    taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    taskComponent.setArchiveClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    taskComponent.setFavoriteClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    render(this._container, taskComponent, RenderPosition.BEFOREEND);
  }
}
