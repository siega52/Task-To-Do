import { type Todo } from '../types/todo';

export class AddTodoForm {
  private form: HTMLFormElement;
  private onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;

  constructor(onSubmit: (todo: Omit<Todo, 'id' | 'createdAt'>) => void) {
    this.onSubmit = onSubmit;
    this.form = this.createForm();
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'todo-form';
    
    form.innerHTML = `
      <div class="todo-form__input-group">
        <input 
          type="text" 
          class="todo-form__input" 
          placeholder="Что нужно сделать?" 
          required
        >
        <select class="todo-form__select" name="priority">
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
        <input 
          type="text" 
          class="todo-form__input" 
          placeholder="Категория"
          name="category"
        >
        <button type="submit" class="todo-form__button">Добавить</button>
      </div>
    `;

    form.addEventListener('submit', this.handleSubmit.bind(this));
    return form;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const formData = new FormData(this.form);
    const text = (this.form.querySelector('.todo-form__input') as HTMLInputElement).value.trim();
    const priority = formData.get('priority') as Todo['priority'];
    const category = (formData.get('category') as string) || 'Общее';

    if (text) {
      this.onSubmit({
        text,
        completed: false,
        priority,
        category
      });

      this.form.reset();
      (this.form.querySelector('.todo-form__input') as HTMLInputElement).focus();
    }
  }

  render(): HTMLElement {
    return this.form;
  }
}