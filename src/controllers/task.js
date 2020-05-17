import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {COLOR, KEY} from "../const";
import {remove, render, RenderPosition, replace} from "../utils/render";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class TaskController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._mode = Mode.DEFAULT;
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._viewChangeHandler = viewChangeHandler;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._taskEditComponent.reset();
    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._viewChangeHandler();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KEY.ESC) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`click`, this._escKeyDownHandler);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

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
      const data = this._taskEditComponent.getData();
      this._dataChangeHandler(this, task, data);
    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => this._dataChangeHandler(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskComponent && oldTaskEditComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskComponent && oldTaskEditComponent) {
          remove(oldTaskEditComponent);
          remove(oldTaskComponent);
        }
        document.addEventListener(`click`, this._escKeyDownHandler);
        render(this._container, this._taskEditComponent, RenderPosition.BEFOREEND);
        break;
    }
  }
}
