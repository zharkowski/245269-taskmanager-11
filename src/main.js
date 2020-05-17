// models
import TasksModel from "./models/tasks";
// components
import MenuComponent, {MenuItem} from "./components/menu";
import BoardComponent from "./components/board";
// controllers
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";
// mocks
import generateTasks from "./mock/task";
// utils
import {render, RenderPosition} from "./utils/render";

const TASKS_COUNT = 20;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
render(headerElement, menuComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASKS_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

menuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      menuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
