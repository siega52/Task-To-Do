import type { Todo, FilterType, SortType } from '../types/todo';

export const helpers = {
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  filterTodos(todos: Todo[], filter: FilterType): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },

  sortTodos(todos: Todo[], sort: SortType): Todo[] {
    const sorted = [...todos];
    
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
      default:
        return sorted;
    }
  }
};