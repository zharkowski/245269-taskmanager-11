import Task from "./models/task";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }
  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
      .then((response) => response.json())
      .then(Task.parseTasks)
      .catch(() => []);
  }
};

export default API;
