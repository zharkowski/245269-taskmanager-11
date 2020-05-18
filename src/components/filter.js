import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter__`;

const getFilterNameById = (id) => id.substring(FILTER_ID_PREFIX.length);

const createFilterTemplate = (filter) => {
  const {name, count, checked} = filter;
  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${checked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map(
      (filter) => createFilterTemplate(filter)
  ).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
