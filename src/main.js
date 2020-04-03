import {getMenuMarkup} from "./components/menu";
import {getFiltersMarkup} from "./components/filters";
import {getSortingMarkup} from "./components/sorting";
import {getAddingTaskFormMarkup} from "./components/addingTaskForm";
import {getCardMarkup} from "./components/card";
import {getLoadMoreButtonMarkup} from "./components/loadMoreButton";

const render = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const mainElement = document.querySelector(`.main`);
const controlElement = mainElement.querySelector(`.main__control`);

render(controlElement, getMenuMarkup());
render(mainElement, getFiltersMarkup());
render(mainElement, getSortingMarkup());

const boardElement = mainElement.querySelector(`.board`);
const boardTasksElement = boardElement.querySelector(`.board__tasks`);

render(boardTasksElement, getAddingTaskFormMarkup());
render(boardTasksElement, getCardMarkup());
render(boardTasksElement, getCardMarkup());
render(boardTasksElement, getCardMarkup());
render(boardElement, getLoadMoreButtonMarkup());
