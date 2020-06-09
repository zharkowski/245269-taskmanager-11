const API = class {
  getTasks() {
    return fetch(`https://11.ecmascript.pages.academy/task-manager`);
  }
};

export default API;
