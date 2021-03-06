import AbstractComponent from "./abstract-component";
import {formatTime, formatDate, isOverdueDate} from "../utils/common";
import {encode} from "he";

const createTaskTemplate = (task) => {
  const {
    description: notSanitizedDescription = `This is example of new task, you can set date and time.`,
    dueDate,
    repeatingDays,
    color = `black`,
  } = task;

  const description = encode(notSanitizedDescription);
  const isDateShowing = !!dueDate;
  const repeatClass = repeatingDays
    && Object.values(repeatingDays).findIndex((item) => item) !== -1 ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && isOverdueDate(dueDate, new Date())) ? `card--deadline` : ``;
  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const createButtonTemplate = (name, isActive = true) => {
    return (
      `<button type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
        ${name}
      </button>`
    );
  };

  const editButtonTemplate = createButtonTemplate(`edit`);
  const archiveButtonTemplate = createButtonTemplate(`archive`, !task.isArchive);
  const favoriteButtonTemplate = createButtonTemplate(`favorites`, !task.isFavorite);

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButtonTemplate}
            ${archiveButtonTemplate}
            ${favoriteButtonTemplate}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, cb);
  }

  setArchiveClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, cb);
  }

  setFavoriteClickHandler(cb) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, cb);
  }
}
