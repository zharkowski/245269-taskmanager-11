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
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._taskComponent.setArchiveClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive
      }));
    });

    this._taskComponent.setFavoriteClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite
      }));
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }
}
