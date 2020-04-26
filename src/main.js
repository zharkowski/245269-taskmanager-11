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
import generateTasks from "./mock/card";
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
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const editForm = taskEditComponent.getElement().querySelector(`form`);

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

const renderBoard = (boardElement, tasks) => {
  render(boardElement, new SortComponent().getElement(), RENDER_POSITION.BEFOREEND);
  render(boardElement, new TasksComponent().getElement(), RENDER_POSITION.BEFOREEND);

  const taskListElement = boardElement.querySelector(`.board__tasks`);

  let showingCardsCount = FIRST_SHOW_TASKS_COUNT;
  tasks.slice(0, showingCardsCount).forEach(
      (task) => renderTask(taskListElement, task)
  );

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardElement, loadMoreButtonComponent.getElement(), RENDER_POSITION.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingCardsCount;
    showingCardsCount += ON_BUTTON_CLICK_TASKS_COUNT;

    tasks.slice(prevTasksCount, showingCardsCount).forEach(
        (task) => renderTask(taskListElement, task)
    );

    if (showingCardsCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
};

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASKS_COUNT);
const filters = generateFilters();

render(headerElement, new MenuComponent().getElement(), RENDER_POSITION.BEFOREEND);
render(mainElement, new FilterComponent(filters).getElement(), RENDER_POSITION.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent.getElement(), RENDER_POSITION.BEFOREEND);
renderBoard(boardComponent.getElement(), tasks);
