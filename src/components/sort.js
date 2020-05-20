import AbstractComponent from "./abstract-component";

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setDefaultSortType() {
    this._currentSortType = SortType.DEFAULT;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (sortType === this.getSortType()) {
        return;
      }

      this._currentSortType = sortType;
      handler(this.getSortType());
    });
  }
}
