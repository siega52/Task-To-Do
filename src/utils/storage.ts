import { Todo, Theme } from '../types/todo'; 

const STORAGE_KEYS = {
  TODOS: 'smart-todos',
  THEME: 'smart-theme',
  SETTINGS: 'smart-settings'
} as const;

export const storage = {
  // Todos
  getTodos(): Todo[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TODOS);
      return stored ? JSON.parse(stored).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      })) : [];
    } catch {
      return [];
    }
  },

  saveTodos(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  },

  // Theme
  getTheme(): Theme {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light';
  },

  saveTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
};