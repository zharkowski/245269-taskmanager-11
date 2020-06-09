// models
import TasksModel from "./models/tasks";
// components
import MenuComponent, {MenuItem} from "./components/menu";
import BoardComponent from "./components/board";
import Statistic from "./components/statistic";
// controllers
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";
// mocks
import generateTasks from "./mock/task";
// utils
import {render, RenderPosition} from "./utils/render";

const TASKS_COUNT = 20;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASKS_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);
const statisticComponent = new Statistic({tasks: tasksModel, dateFrom, dateTo});

render(headerElement, menuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();
render(mainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      statisticComponent.hide();
      boardController.show();
      menuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
    case MenuItem.TASKS:
      statisticComponent.hide();
      boardController.show();
      break;
    case MenuItem.STATISTIC:
      boardController.hide();
      boardController.setDefaultSort();
      statisticComponent.show();
      break;
  }
});
