import { type Todo } from '../types/todo';

export class TodoItem {
  private element: HTMLLIElement;
  private onToggle: (id: string) => void;
  private onDelete: (id: string) => void;
  private onEdit: (id: string, text: string) => void;

  constructor(
    todo: Todo,
    onToggle: (id: string) => void,
    onDelete: (id: string) => void,
    onEdit: (id: string, text: string) => void
  ) {
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.element = this.createTodoItem(todo);
  }

  private createTodoItem(todo: Todo): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'todo-item';
    
    const formattedDate = todo.createdAt.toLocaleDateString('ru-RU');
    
    li.innerHTML = `
      <div class="todo-item__checkbox">
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      </div>
      <div class="todo-item__content ${todo.completed ? 'todo-item__content--completed' : ''}">
        <div class="todo-item__text">${this.escapeHtml(todo.text)}</div>
        <div class="todo-item__meta">
          <span class="todo-item__category">${this.escapeHtml(todo.category)}</span>
          <span class="todo-item__date">${formattedDate}</span>
          <span class="todo-item__priority todo-item__priority--${todo.priority}">
            ${this.getPriorityText(todo.priority)}
          </span>
        </div>
      </div>
      <div class="todo-item__actions">
        <button class="todo-item__button todo-item__button--edit" title="Редактировать">
          ✏️
        </button>
        <button class="todo-item__button todo-item__button--delete" title="Удалить">
          🗑️
        </button>
      </div>
    `;

    this.bindEvents(li, todo);
    return li;
  }

  private bindEvents(li: HTMLLIElement, todo: Todo): void {
    const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
    const deleteBtn = li.querySelector('.todo-item__button--delete') as HTMLButtonElement;
    const editBtn = li.querySelector('.todo-item__button--edit') as HTMLButtonElement;
    const textElement = li.querySelector('.todo-item__text') as HTMLDivElement;

    checkbox.addEventListener('change', () => this.onToggle(todo.id));
    deleteBtn.addEventListener('click', () => this.onDelete(todo.id));
    
    editBtn.addEventListener('click', () => {
      const currentText = textElement.textContent || '';
      const input = document.createElement('input');
      input.type = 'text';
      input.value = currentText;
      input.className = 'todo-form__input';
      
      textElement.replaceWith(input);
      input.focus();
      
      const saveEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== currentText) {
          this.onEdit(todo.id, newText);
        }
        input.replaceWith(textElement);
      };
      
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        }
      });
    });
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private getPriorityText(priority: Todo['priority']): string {
    const texts = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
    return texts[priority];
  }

  render(): HTMLElement {
    return this.element;
  }
}