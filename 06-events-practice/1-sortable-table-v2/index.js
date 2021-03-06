export default class SortableTable {

  element;
  subElements = {};

  constructor(header = [], {data = []} = {}) {
    this.header = [...header];
    this.data = data;
    this.initElements();
    this.initEventListeners();
  }

  initElements() {
    const createdElement = document.createElement('div');
    createdElement.innerHTML = this.template;
    this.element = createdElement.firstElementChild;
    this.subElements = this.getSubElements();
  }

  get template() {
    return `
        <div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.renderHeader()}
                </div>
                <div data-element="body" class="sortable-table__body">
                ${this.renderRows()}
                </div>
            </div>
        </div>
    `;
  }

  renderHeader() {
    return this.header.map(item => `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
        <span>${item.title}</span> ${this.renderArrow()}
      </div>`).join(' ');
  }

  renderArrow() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
  }

  renderRows() {
    return this.data.map(item => {
      return `<a href="/products/${item.id}" class="sortable-table__row">
                ${this.renderRow(item)}
              </a>`;
    }).join('');
  }

  renderRow(row) {
    const headers = this.header.map(({id, template}) => {
      return {id, template};
    });

    return headers.map(({id, template}) => template ? template(row[id]) : `<div class="sortable-table__cell">${row[id]}</div>`).join('');
  }

  sort(fieldValue, fieldOrder) {
    const direction = fieldOrder === 'asc' ? 1 : -1;
    const arr = [...this.data];
    this.removeArrow();
    const sortingElement = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);
    sortingElement.dataset.order = fieldOrder;
    const sortingHeader = this.header.find(item => item.id === fieldValue);
    const {sortType} = sortingHeader;
    arr.sort((a, b) => {
      switch (sortType) {
      case 'string':
        return direction * a[fieldValue].localeCompare(b[fieldValue], 'ru');
      case 'number':
        return direction * (a[fieldValue] - b[fieldValue]);
      default:
        return;
      }
    });
    this.data = arr;
    this.subElements.body.innerHTML = this.renderRows();
  }


  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  removeArrow() {
    const headers = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    headers.forEach(header => header.dataset.order = '');
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  onSortClick = event => {
    const sortColumn = event.target.closest('[data-sortable="true"]');
    if (sortColumn) {
      const {id, order} = sortColumn.dataset;
      const switchOrder = {asc: 'desc', desc: 'asc'};
      this.sort(id, switchOrder[order]);
    }
  };

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }
}

