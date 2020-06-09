export default class Task {
  constructor(data) {
    this.id = data[`id`];
    this.color = data[`color`];
    this.description = data[`description`] || ``;
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.isArchived = Boolean(data[`is_archived`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.repeatingDays = data[`repeating_days`];
  }

  static parseTask(data) {
    return new Task(data);
  }

  static parseTasks(data) {
    return data.map(Task.parseTask);
  }
}
