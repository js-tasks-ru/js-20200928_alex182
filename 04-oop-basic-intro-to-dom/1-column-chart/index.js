export default class ColumnChart {

  chartHeight = 50;

  constructor({data = [], label = '', value = 0, link = ''} = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    if (this.data.length) {
      element.firstElementChild.classList.remove('column-chart_loading');
    }
    this.element = element.firstElementChild;
  }

  get template() {
    return `<div class="column-chart column-chart_loading" style="--chart-height: 50">
               <div class="column-chart__title">Total ${this.label}
                    ${this.getLink()}
               </div>
               <div class="column-chart__container">
                    <div class="column-chart__header" data-element="header">${this.value}</div>
                    <div class="column-chart__chart" data-element="body">${this.getColumns()}</div>
                </div>
            </div>
    `;
  }

  getColumns() {
    const maxValue = Math.max(...this.data);
    if (maxValue === 0) {
      return;
    }
    return this.data.map(value => `<div style="--value: ${this.calculateHeight(value, maxValue)}"
                        data-tooltip="${(value / maxValue).toFixed(2) * 100}%"></div>`).join('');
  }

  calculateHeight(value, maxValue) {
    return Math.floor(value / maxValue * this.chartHeight);
  }

  getLink() {
    return `${this.link && `<a class="column-chart__link" href="${this.link}">View all</a>`}`;
  }

  update(data) {
    this.data = data;
    const element = this.element.querySelector('.column-chart__chart');
    element.innerHTML = this.getColumns();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
