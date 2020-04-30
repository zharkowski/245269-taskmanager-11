import {MONTH_NAMES} from '../const';
import AbstractComponent from "./abstract-component";

const createTaskTemplate = (task) => {
  const {
    description = `This is example of new task, you can set date and time.`,
    dueDate,
    repeatingDays,
    color = `black`,
    isFavorite,
    isArchive
  } = task;

  const repeatClass = repeatingDays
    && Object.values(repeatingDays).findIndex((item) => item) !== -1 ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && dueDate < Date.now()) ? `card--deadline` : ``;
  const date = dueDate ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = dueDate ? `${dueDate.getHours()}:${dueDate.getMinutes()}` : ``;
  const archiveButtonInactiveClass = isArchive ? `` : `card__btn--disabled`;
  const favoriteButtonInactiveClass = isFavorite ? `` : `card__btn--disabled`;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${archiveButtonInactiveClass}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${favoriteButtonInactiveClass}"
            >
              favorites
            </button>
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
}
