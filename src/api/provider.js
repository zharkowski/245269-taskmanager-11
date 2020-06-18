import Task from "../models/task";

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach((task) => this._store.setItem(task.id, task.toRAW()));

          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());
    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  updateTask(id, task) {
    if (isOnline()) {
      return this._api.updateTask(id, task)
        .then((newTasks) => {
          this._store.setItem(newTasks.id, newTasks.toRAW());

          return newTasks;
        });
    }

    const localTask = Task.clone(Object.assign(task, {id}));

    this._store.setItem(id, localTask.toRAW());

    return Promise.resolve(localTask);
  }

  createTask(data) {
    if (isOnline()) {
      return this._api.createTask(data);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);

    return Promise.resolve();
  }
}
