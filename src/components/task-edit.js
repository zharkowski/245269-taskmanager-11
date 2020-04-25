import {COLORS, MONTH_NAMES, DAYS} from "../const";
import {createElement} from "../utils";

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

const createTaskEditTemplate = (card) => {
  const {
    description = `This is example of new task, you can set date and time.`,
    dueDate,
    repeatingDays,
    color = `black`,
  } = card;
  const hasRepeat = repeatingDays && Object.values(repeatingDays).findIndex((item) => item) !== -1;
  const repeatClass = hasRepeat ? `card--repeat` : ``;
  const deadlineClass = dueDate < Date.now() ? `card--deadline` : ``;
  const date = dueDate ?
    `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]} ${dueDate.getHours()}:${dueDate.getMinutes()}`
    : ``;

  const repeatingDaysMarkup = repeatingDays ? createRepeatingDaysTemplate(DAYS, repeatingDays) : ``;
  const colorMarkup = createColorTemplate(COLORS, color);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
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
                  date: <span class="card__date-status">${dueDate ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline" ${dueDate ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="23 September"
                      name="date"
                      value="${date}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${hasRepeat ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${hasRepeat ? `` : `disabled`}>
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>
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
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit {
  constructor(task) {
    this._task = task;
    this._element = null;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
