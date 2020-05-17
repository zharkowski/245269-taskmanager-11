// models
import TasksModel from "./models/tasks";
// components
import MenuComponent from "./components/menu";
import BoardComponent from "./components/board";
import Filter from "./components/filter";
// mocks
import generateFilters from "./mock/filter";
import generateTasks from "./mock/task";
// utils
import {render, RenderPosition} from "./utils/render";
import BoardController from "./controllers/board";

const TASKS_COUNT = 20;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASKS_COUNT);
const filters = generateFilters();

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

render(headerElement, new MenuComponent(), RenderPosition.BEFOREEND);
render(mainElement, new Filter(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);

render(mainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();
