// models
import TasksModel from "./models/tasks";
// components
import MenuComponent from "./components/menu";
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

const tasks = generateTasks(TASKS_COUNT);

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

render(headerElement, new MenuComponent(), RenderPosition.BEFOREEND);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(mainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();
