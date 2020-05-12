import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    if (new.target === AbstractSmartComponent) {
      throw new Error(`Can't instantiate AbstractSmartComponent, only concrete one.`);
    }
    super();
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();
    const parentElement = oldElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();
    parentElement.replaceChild(newElement, oldElement);
    this.recoveryListeners();
  }
}
