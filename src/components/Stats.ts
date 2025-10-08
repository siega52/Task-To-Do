import { type Todo } from '../types/todo';

export class Stats {
  private element: HTMLDivElement;

  constructor() {
    this.element = this.createStats();
  }

  private createStats(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'stats';
    return div;
  }

  update(todos: Todo[]): void {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;

    this.element.innerHTML = `
      <div class="stats__grid">
        <div class="stats__item">
          <div class="stats__item__value">${total}</div>
          <div class="stats__item__label">Всего задач</div>
        </div>
        <div class="stats__item">
          <div class="stats__item__value">${active}</div>
          <div class="stats__item__label">Активных</div>
        </div>
        <div class="stats__item">
          <div class="stats__item__value">${completed}</div>
          <div class="stats__item__label">Завершено</div>
        </div>
        <div class="stats__item">
          <div class="stats__item__value">${highPriority}</div>
          <div class="stats__item__label">Высокий приоритет</div>
        </div>
      </div>
    `;
  }

  render(): HTMLElement {
    return this.element;
  }
}