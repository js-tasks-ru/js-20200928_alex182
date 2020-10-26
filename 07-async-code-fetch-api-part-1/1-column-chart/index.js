import fetchData from './utils/fetch-json.js';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;
  static URL = 'https://course-js.javascript.ru';

  constructor({
    url = '', range = {
      from: new Date(),
      to: new Date()
    }, label = '', link, formatHeading = (data) => data
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.render();
    this.getData(this.range.from, this.range.to);
  }

  render() {
    const createdElement = document.createElement('div');
    createdElement.innerHTML = this.template;
    this.element = createdElement.firstElementChild;
    this.subElements = this.getSubElements();
  }

  get template() {
    return `
            <div class="column-chart column-chart_loading">
            <div class="column-chart__title">
               Total ${this.label}
               ${this.getLink()}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header"></div>
                <div data-element="body" class="column-chart__chart">
            </div>
           `;
  }

  getLink() {
    return this.link ? `<a class="column-chart__link">View all</a>` : '';
  }


  async getData(from, to) {
    this.element.classList.add('column-chart_loading');
    this.subElements.header.textContent = '';
    this.subElements.body.innerHTML = '';
    const url = new URL(ColumnChart.URL);
    url.pathname = this.url;
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    const data = await fetchData(url);
    if (data) {
      this.removeLoadingClass();
      this.subElements.header.textContent = this.formatHeading(this.getTotalValue(data));
      this.subElements.body.innerHTML = this.getColumnBody(data);
    }
  }

  removeLoadingClass() {
    this.element.classList.remove('column-chart_loading');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, currElement) => {
      accum[currElement.dataset.element] = currElement;
      return accum;
    }, {});
  }

  update = async (from, to) => this.getData(from, to);

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));
    return Object.entries(data).map(([key, value]) => {
      const scale = this.chartHeight / maxValue;
      const percent = (value / maxValue * 100).toFixed(0);
      const tooltip = `<span>
        <small>${key.toLocaleString('default', {dateStyle: 'medium'})}</small>
        <br>
        <strong>${percent}%</strong>
      </span>`;
      return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${tooltip}"></div>`;
    }).join('');
  }

  getTotalValue(data) {
    return Object.values(data).reduce((sum, value) => sum += value, 0);
  }
}
