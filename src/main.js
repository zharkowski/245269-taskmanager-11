// components
import MenuComponent from "./components/menu";
import BoardComponent from "./components/board";
import FilterComponent from "./components/filter";
// mocks
import generateFilters from "./mock/filter";
import generateTasks from "./mock/card";
// utils
import {render, RENDER_POSITION} from "./utils/render";
import BoardController from "./controllers/board";

const TASKS_COUNT = 20;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASKS_COUNT);
const filters = generateFilters();

render(headerElement, new MenuComponent(), RENDER_POSITION.BEFOREEND);
render(mainElement, new FilterComponent(filters), RENDER_POSITION.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(mainElement, boardComponent, RENDER_POSITION.BEFOREEND);
boardController.render(tasks);
