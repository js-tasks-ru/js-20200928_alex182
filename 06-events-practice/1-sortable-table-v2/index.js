import SortableTableV1 from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableV1 {

  constructor(header = [], {data = []} = {}) {
    super(header, {data});
    this.initEventListeners();
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


}

