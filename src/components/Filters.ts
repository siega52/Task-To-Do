import type { FilterType, SortType } from '../types/todo';

export class Filters {
  private element: HTMLDivElement;
  private onFilterChange: (filter: FilterType) => void;
  private onSortChange: (sort: SortType) => void;
  private onClearCompleted: () => void;

  constructor(
    onFilterChange: (filter: FilterType) => void,
    onSortChange: (sort: SortType) => void, 
    onClearCompleted: () => void
  ) {
    this.onFilterChange = onFilterChange;
    this.onSortChange = onSortChange;
    this.onClearCompleted = onClearCompleted;
    this.element = this.createFilters();
  }

  private createFilters(): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'filters';
    
    div.innerHTML = `
      <div class="filters__group">
        <span>Фильтр:</span>
        <button class="filters__button active" data-filter="all">Все</button>
        <button class="filters__button" data-filter="active">Активные</button>
        <button class="filters__button" data-filter="completed">Завершенные</button>
      </div>
      <div class="filters__group">
        <span>Сортировка:</span>
        <select class="filters__select" name="sort">
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
          <option value="priority">По приоритету</option>
        </select>
      </div>
      <div class="filters__group">
        <button class="filters__button" id="clear-completed">
          Очистить завершенные
        </button>
      </div>
    `;

    this.bindEvents(div);
    return div;
  }

  private bindEvents(container: HTMLDivElement): void {
    const filterButtons = container.querySelectorAll('[data-filter]');
    const sortSelect = container.querySelector('.filters__select') as HTMLSelectElement;
    const clearButton = container.querySelector('#clear-completed') as HTMLButtonElement;

    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const filter = target.dataset.filter as FilterType;
        
        // Обновляем активную кнопку
        filterButtons.forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');
        
        this.onFilterChange(filter);
      });
    });

    sortSelect.addEventListener('change', () => {
      this.onSortChange(sortSelect.value as SortType);
    });

    clearButton.addEventListener('click', () => {
      this.onClearCompleted();
    });
  }

  render(): HTMLElement {
    return this.element;
  }
}