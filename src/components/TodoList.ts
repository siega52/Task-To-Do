import type { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';

export class TodoList {
  private element: HTMLUListElement;
  private todos: Todo[] = [];
  private onToggle: (id: string) => void;
  private onDelete: (id: string) => void;
  private onEdit: (id: string, text: string) => void;

  constructor(
    onToggle: (id: string) => void,
    onDelete: (id: string) => void,
    onEdit: (id: string, text: string) => void
  ) {
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.element = this.createTodoList();
  }

  private createTodoList(): HTMLUListElement {
    const ul = document.createElement('ul');
    ul.className = 'todo-list';
    return ul;
  }

  update(todos: Todo[]): void {
    this.todos = todos;
    this.renderTodos();
  }

  private renderTodos(): void {
    this.element.innerHTML = '';

    if (this.todos.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'todo-list__empty';
      emptyMessage.textContent = 'Задач пока нет. Добавьте первую задачу!';
      this.element.appendChild(emptyMessage);
      return;
    }

    this.todos.forEach(todo => {
      const todoItem = new TodoItem(todo, this.onToggle, this.onDelete, this.onEdit);
      this.element.appendChild(todoItem.render());
    });
  }

  // ОДИН метод render
  render(): HTMLElement {
    return this.element;
  }
}