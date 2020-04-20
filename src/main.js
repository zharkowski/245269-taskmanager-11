import {getMenuMarkup} from "./components/menu";
import getFiltersTemplate from "./components/filter";
import {getSortingMarkup} from "./components/sorting";
import getAddingTaskFormMarkup from "./components/addingTaskForm";
import createCardMarkup from "./components/card";
import {getLoadMoreButtonMarkup} from "./components/loadMoreButton";
import generateCards from "./mock/card";

const CARDS_COUNT = 20;
const FIRST_SHOW_CARDS_COUNT = 8;
const ON_BUTTON_CLICK_CARDS_COUNT = 8;

const cardMocks = generateCards(CARDS_COUNT);
let showingCardsCount = FIRST_SHOW_CARDS_COUNT;

const render = (container, markup) => {
  container.insertAdjacentHTML(`beforeend`, markup);
};

const mainElement = document.querySelector(`.main`);
const controlElement = mainElement.querySelector(`.main__control`);

render(controlElement, getMenuMarkup());
render(mainElement, getFiltersTemplate());
render(mainElement, getSortingMarkup());

const boardElement = mainElement.querySelector(`.board`);
const boardTasksElement = boardElement.querySelector(`.board__tasks`);

render(boardTasksElement, getAddingTaskFormMarkup(cardMocks[0]));
for (let i = 1; i < showingCardsCount; i++) {
  render(boardTasksElement, createCardMarkup(cardMocks[i]));
}
render(boardElement, getLoadMoreButtonMarkup());

const loadMoreButton = document.querySelector(`button.load-more`);

const showMoreCards = (currentIndex) => {
  for (let i = currentIndex; i < currentIndex + ON_BUTTON_CLICK_CARDS_COUNT; i++) {
    if (cardMocks[i]) {
      render(boardTasksElement, createCardMarkup(cardMocks[i]));
      showingCardsCount++;
    } else {
      loadMoreButton.classList.add(`visually-hidden`);
      break;
    }
  }
};

loadMoreButton.addEventListener(`click`, () => {
  showMoreCards(showingCardsCount);
});
