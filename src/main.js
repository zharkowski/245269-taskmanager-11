// API
import API from "./api/api";
// Provider
import Provider from "./api/provider";
// Store
import Store from "./api/store";
// models
import TasksModel from "./models/tasks";
// components
import MenuComponent, {MenuItem} from "./components/menu";
import BoardComponent from "./components/board";
import StatisticComponent from "./components/statistic";
import LoadingComponent from "./components/loading";
import NoTasksComponent from "./components/no-tasks";
// controllers
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter";
// utils
import {remove, render, RenderPosition} from "./utils/render";

const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();

const menuComponent = new MenuComponent();
const filterController = new FilterController(mainElement, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);
const loadingComponent = new LoadingComponent();
const statisticComponent = new StatisticComponent({tasks: tasksModel, dateFrom, dateTo});

render(headerElement, menuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(mainElement, loadingComponent, RenderPosition.BEFOREEND);
render(mainElement, boardComponent, RenderPosition.BEFOREEND);
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

apiWithProvider.getTasks()
  .then((tasks) => {
    remove(loadingComponent);
    tasksModel.setTasks(tasks);
    if (tasks.length === 0) {
      const noTasksComponent = new NoTasksComponent();
      render(boardComponent.getElement(), noTasksComponent, RenderPosition.BEFOREEND);
    } else {
      boardController.render();
    }
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {

    })
    .catch(() => {

    });
});
