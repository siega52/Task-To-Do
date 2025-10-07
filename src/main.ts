import { Todo, FilterType, SortType, Theme } from './types/todo';
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { Filters } from './components/Filters';
import { Stats } from './components/Stats';
import { storage } from './utils/storage';
import { helpers } from './utils/helpers';
import './styles/main.scss';

class SmartTodoApp {
  private todos: Todo[] = [];
  private currentFilter: FilterType = 'all';
  private currentSort: SortType = 'newest';
  private currentTheme: Theme = 'light';

  private addTodoForm: AddTodoForm;
  private todoList: TodoList;
  private filters: Filters;
  private stats: Stats;

  private appContainer: HTMLDivElement;

  constructor() {
    this.init();
  }

  private init(): void {
    this.loadData();
    this.createApp();
    this.render();
    this.bindThemeToggle();
  }

  private loadData(): void {
    this.todos = storage.getTodos();
    this.currentTheme = storage.getTheme();
    this.applyTheme(this.currentTheme);
  }

  private createApp(): void {
    this.appContainer = document.createElement('div');
    this.appContainer.className = 'app';
    
    this.addTodoForm = new AddTodoForm(this.handleAddTodo.bind(this));
    this.todoList = new TodoList([], this.handleToggleTodo.bind(this), this.handleDeleteTodo.bind(this), this.handleEditTodo.bind(this));
    this.filters = new Filters(this.handleFilterChange.bind(this), this.handleSortChange.bind(this), this.handleClearCompleted.bind(this));
    this.stats = new Stats();

    const container = document.createElement('div');
    container.className = 'container';
    
    container.innerHTML = `
      <header class="header">
        <h1>📝 Smart Todo</h1>
        <p>Умный менеджер ваших задач</p>
      </header>
    `;

    container.appendChild(this.addTodoForm.render());
    container.appendChild(this.filters.render());
    container.appendChild(this.todoList.render());
    container.appendChild(this.stats.render());

    this.appContainer.appendChild(container);
    document.body.appendChild(this.appContainer);
  }

  private render(): void {
    const filteredTodos = helpers.filterTodos(this.todos, this.currentFilter);
    const sortedTodos = helpers.sortTodos(filteredTodos, this.currentSort);
    
    this.todoList.update(sortedTodos);
    this.stats.update(this.todos);
    this.saveData();
  }

  private handleAddTodo(todoData: Omit<Todo, 'id' | 'createdAt'>): void {
    const newTodo: Todo = {
      ...todoData,
      id: helpers.generateId(),
      createdAt: new Date()
    };

    this.todos.unshift(newTodo);
    this.render();
  }

  private handleToggleTodo(id: string): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.render();
  }

  private handleDeleteTodo(id: string): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.render();
  }

  private handleEditTodo(id: string, newText: string): void {
    this.todos = this.todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    this.render();
  }

  private handleFilterChange(filter: FilterType): void {
    this.currentFilter = filter;
    this.render();
  }

  private handleSortChange(sort: SortType): void {
    this.currentSort = sort;
    this.render();
  }

  private handleClearCompleted(): void {
    this.todos = this.todos.filter(todo => !todo.completed);
    this.render();
  }

  private bindThemeToggle(): void {
    const toggleButton = document.createElement('button');
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
    toggleButton.title = 'Сменить тему';

    toggleButton.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      toggleButton.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
      storage.saveTheme(this.currentTheme);
    });

    document.body.appendChild(toggleButton);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private saveData(): void {
    storage.saveTodos(this.todos);
  }
}

// Инициализация приложения
new SmartTodoApp();