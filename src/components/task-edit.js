import {COLORS, DAYS} from "../const";
import AbstractSmartComponent from "./abstract-smart-component";
import flatpickr from "flatpickr";
import {formatTime, formatDate, isRepeating, isOverdueDate} from "../utils/common";
import "flatpickr/dist/flatpickr.min.css";
import {encode} from "he";

const MIN_DESCRIPTION__LENGTH = 1;
const MAX_DESCRIPTION__LENGTH = 140;

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const isAllowDescriptionLength = (description) => {
  const length = description.length;
  return length >= MIN_DESCRIPTION__LENGTH && length <= MAX_DESCRIPTION__LENGTH;
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

const createTaskEditTemplate = (task, options = {}) => {
  const {
    dueDate,
  } = task;
  const {
    isDateShowing,
    isRepeatingTask,
    activeRepeatingDays,
    activeColor,
    currentDescription = `This is example of new task, you can set date and time.`,
    externalData,
  } = options;

  const description = encode(currentDescription);
  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = (dueDate instanceof Date && isOverdueDate(dueDate, new Date())) ? `card--deadline` : ``;
  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  const isSaveButtonBlocked = (isDateShowing && isRepeatingTask)
    || (isRepeatingTask && !isRepeating(activeRepeatingDays))
    || !isAllowDescriptionLength(description);

  const repeatingDaysMarkup = createRepeatingDaysTemplate(DAYS, activeRepeatingDays);
  const colorMarkup = createColorTemplate(COLORS, activeColor);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

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
                      value="${date} ${time}"
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
            <button class="card__save" type="submit" ${isSaveButtonBlocked ? `disabled` : ``}>${saveButtonText}</button>
            <button class="card__delete" type="button">${deleteButtonText}</button>
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
    this._currentDescription = task.description;
    this._activeColor = task.color;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;
    this._externalData = DefaultData;
    this._flatpickr = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    if (this._isDateShowing) {
      const dateElement = this.getElement().querySelector(`.card__date`);
      this._flatpickr = flatpickr(dateElement, {
        altInput: true,
        allowInput: true,
        defaultDate: this._task.dueDate || `today`,
      });
    }
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

    element.querySelector(`.card__text`).addEventListener(`input`, (evt) => {
      this._currentDescription = evt.target.value;
      const saveButton = this.getElement().querySelector(`.card__save`);
      saveButton.disabled = !isAllowDescriptionLength(this._currentDescription);
    });
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createTaskEditTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
      activeColor: this._activeColor,
      currentDescription: this._currentDescription,
      externalData: this._externalData,
    });
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  reset() {
    const task = this._task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._currentDescription = task.description;

    this.rerender();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  getData() {
    const form = this.getElement().querySelector(`.card__form`);
    return new FormData(form);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__delete`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }
}
