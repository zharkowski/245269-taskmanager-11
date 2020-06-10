// components
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
// models
import TaskModel from "../models/task";
// utils
import {remove, render, RenderPosition, replace} from "../utils/render";
// consts
import {COLOR, DAYS, KEY} from "../const";

const SHAKE_ANIMATION_TIMEOUT = 600;

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
  isArchived: false,
};

const parseFormData = (formData) => {
  const repeatingDays = DAYS.reduce((acc, day) => {
    acc[day] = false;
    return acc;
  }, {});
  const date = formData.get(`date`);

  return new TaskModel({
    "description": formData.get(`text`),
    "color": formData.get(`color`),
    "due_date": date ? new Date(date) : null,
    "repeating_days": formData.getAll(`repeat`).reduce((acc, it) => {
      acc[it] = true;
      return acc;
    }, repeatingDays),
    "is_favorite": false,
    "is_archived": false,
  });
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

  shake() {
    this._taskEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._taskComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._taskEditComponent.getElement().style.animation = ``;
      this._taskComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
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
      const newTask = TaskModel.clone(task);
      newTask.isArchived = !newTask.isArchived;
      this._dataChangeHandler(this, task, newTask);
    });

    this._taskComponent.setFavoriteClickHandler(() => {
      const newTask = TaskModel.clone(task);
      newTask.isFavorite = !newTask.isFavorite;
      this._dataChangeHandler(this, task, newTask);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._taskEditComponent.getData();
      const data = parseFormData(formData);
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
        render(this._container, this._taskEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }
}
