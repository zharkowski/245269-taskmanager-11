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

  toRAW() {
    return {
      "id": this.id,
      "color": this.color,
      "description": this.description,
      "due_date": this.dueDate ? this.dueDate.toISOString() : null,
      "is_archived": this.isArchived,
      "is_favorite": this.isFavorite,
      "repeating_days": this.repeatingDays,
    };
  }

  static clone(data) {
    return new Task(data.toRAW());
  }
}
