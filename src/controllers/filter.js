import FilterComponent from "../components/filter";
import {FilterType} from "../const";
import {getTasksByFilter} from "../utils/filter";
import {render, RenderPosition, replace} from "../utils/render";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._filterComponent = null;
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._tasksModel.setDataChangeHandler(this._dataChangeHandler);
  }

  _filterChangeHandler(filterType) {
    this._activeFilterType = filterType;
    this._tasksModel.setFilter(filterType);
  }

  _dataChangeHandler() {
    this.render();
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();

    const filter = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filter);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }
}
