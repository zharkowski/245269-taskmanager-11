import generateFilters from "../mock/filter";

const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;
  return (
    `<input
      type="radio"
      id="filter__${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span></label
    >`
  );
};

const getFiltersTemplate = () => {
  const filtersMarkup = generateFilters().map(
      (filter, index) => createFilterMarkup(filter, index === 0)
  ).join(`\n`);
  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default getFiltersTemplate;
