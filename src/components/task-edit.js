import {COLORS, MONTH_NAMES, DAYS} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const createRepeatingDaysTemplate = (days, repeatingDays) => {
  return days.map(
      (day, index) => {
        const isChecked = repeatingDays[day];
        return (
          `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}-${index}"
            name="repeat"
            value="${day}"
            ${isChecked ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-${day}-${index}"
            >${day}</label
          >`
        );
      }
  ).join(`\n`);
};

const createColorTemplate = (colors, currentColor) => {
  return COLORS.map(
      (color, index) => {
        return (
          `<input
          type="radio"
          id="color-${color}-${index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${currentColor === color ? `checked` : ``}
        />
        <label
          for="color-${color}-${index}"
          class="card__color card__color--${color}"
          >${color}</label
        >`
        );
      }).join(`\n`);
};

const createTaskEditTemplate = (card, options = {}) => {
  const {
    description = `This is example of new task, you can set date and time.`,
    dueDate,
  } = card;
  const {
    isDateShowing,
    isRepeatingTask,
    activeRepeatingDays,
    activeColor,
  } = options;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && dueDate < Date.now()) ? `card--deadline` : ``;
  const date = (isDateShowing && dueDate) ?
    `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]} ${dueDate.getHours()}:${dueDate.getMinutes()}` : ``;
  const isSaveButtonBlocked = (isDateShowing && isRepeatingTask) || (isRepeatingTask && !isRepeating(activeRepeatingDays));

  const repeatingDaysMarkup = createRepeatingDaysTemplate(DAYS, activeRepeatingDays);
  const colorMarkup = createColorTemplate(COLORS, activeColor);

  return (
    `<article class="card card--edit card--${activeColor} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg width="100%" height="10">
              <use class="card__color-bar-wave" xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${isDateShowing ? `<fieldset class="card__date-deadline">
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="23 September"
                      name="date"
                      value="${date}"
                    />
                  </label>
                </fieldset>` : ``}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                ${isRepeatingTask ? `<fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>` : ``}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isSaveButtonBlocked ? `disable` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._activeColor = task.color;
    this._submitHandler = null;
    this._subscribeOnEvents();
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, () => {
      this._isDateShowing = !this._isDateShowing;
      this.rerender();
    });

    element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, () => {
      this._isRepeatingTask = !this._isRepeatingTask;
      this.rerender();
    });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();
      });
    }

    element.querySelectorAll(`.card__color-input`).forEach((colorElement) => {
      colorElement.addEventListener(`click`, () => {
        this._activeColor = colorElement.value;
        this.rerender();
      });
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      activeColor: this._activeColor,
    });
  }

  reset() {
    const task = this._task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this.rerender();
  }

  setSubmitHandler(cb) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }
}
