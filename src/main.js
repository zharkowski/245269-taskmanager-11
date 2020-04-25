import MenuComponent from "./components/menu";
import BoardComponent from "./components/board";
import FilterComponent from "./components/filter";
import SortComponent from "./components/sort";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import TasksComponent from "./components/tasks";
import LoadMoreButtonComponent from "./components/load-more-button";
// mocks
import generateFilters from "./mock/filter";
import generateCards from "./mock/card";
// utils
import {render} from "./utils";
// const
import {RENDER_POSITION} from "./const";

const TASKS_COUNT = 20;
const FIRST_SHOW_TASKS_COUNT = 8;
const ON_BUTTON_CLICK_TASKS_COUNT = 8;

const renderTask = (tasksListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);
  const editButton = taskComponent.getTemplate().querySelector(`.card__btn--edit`);
  const editForm = taskEditComponent.getTemplate().querySelector(`form`);

  const editButtonClickHandler = () => {
    tasksListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };
  const editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    tasksListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  editButton.addEventListener(`click`, editButtonClickHandler);
  editForm.addEventListener(`submit`, editFormSubmitHandler);

  render(tasksListElement, taskComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

const renderBoard = () => {

};

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const filters = generateFilters();
const task = generateCards(TASKS_COUNT);

// render(headerElement, getMenuMarkup());
// render(mainElement, getFiltersTemplate(filters));
// render(mainElement, createSortingTemplate());
//
// const boardElement = mainElement.querySelector(`.board`);
// const boardTasksElement = boardElement.querySelector(`.board__tasks`);
//
// let showingCardsCount = FIRST_SHOW_TASKS_COUNT;
//
// render(boardTasksElement, getAddingTaskFormMarkup(task[0]));
// for (let i = 1; i < showingCardsCount; i++) {
//   render(boardTasksElement, createCardMarkup(task[i]));
// }
// render(boardElement, getLoadMoreButtonMarkup());
//
// const loadMoreButton = document.querySelector(`button.load-more`);
//
// const showMoreCards = (currentIndex) => {
//   for (let i = currentIndex; i < currentIndex + ON_BUTTON_CLICK_TASKS_COUNT; i++) {
//     if (task[i]) {
//       render(boardTasksElement, createCardMarkup(task[i]));
//       showingCardsCount++;
//     } else {
//       loadMoreButton.classList.add(`visually-hidden`);
//       break;
//     }
//   }
// };
//
// loadMoreButton.addEventListener(`click`, () => {
//   showMoreCards(showingCardsCount);
// });

render(headerElement, new MenuComponent().getElement(), RENDER_POSITION.BEFOREEND);
render(mainElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);
