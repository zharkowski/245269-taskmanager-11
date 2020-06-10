import AbstractComponent from "./abstract-component";

const createLoadingTemplate = () => {
  return (
    `<section class="board container">
      <p class="board__no-tasks">
        Loading...
      </p>
    </section>`
  );
};

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createLoadingTemplate();
  }
}
