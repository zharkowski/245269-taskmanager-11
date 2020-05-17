export default class Tasks {
  constructor() {
    this._tasks = [];

    this._dataChangeHandlers = [];
  }

  getTasks() {
    return this._tasks;
  }

  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateTask(id, updatedTask) {
    const index = this._tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), updatedTask, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
