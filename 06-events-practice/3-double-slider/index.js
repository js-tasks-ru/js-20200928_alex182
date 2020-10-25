export default class DoubleSlider {
  element;
  subElements = {};

  constructor({
    min = 0, max = 100,
    formatValue = (value) => '$' + value,
    selected = {from: min, to: max}
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
  }


  get template() {
    const left = Math.round((this.selected.from - this.min) / (this.max - this.min) * 100);
    const right = Math.round((this.max - this.selected.to) / (this.max - this.min) * 100);
    return `<div class="range-slider">
    <span data-element="from">${this.formatValue(this.selected.from)}</span>
    <div class="range-slider__inner" data-element="inner">
      <span class="range-slider__progress" data-element="progress" style="left: ${left}%; right: ${right}%"></span>
      <span class="range-slider__thumb-left" data-element="thumbLeft" style="left: ${left}%"></span>
      <span class="range-slider__thumb-right" data-element="thumbRight" style="right: ${right}%"></span>
    </div>
    <span data-element="to">${this.formatValue(this.selected.to)}</span>
  </div>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.onThumbPointerMove);
    document.removeEventListener('pointerup', this.onThumbPointerUp);
  }

  render() {
    const createdElement = document.createElement('div');
    createdElement.innerHTML = this.template;
    this.subElements = this.getSubElements(createdElement);
    this.element = createdElement.firstElementChild;
    this.element.ondragstart = () => false;
    this.initEventListeners();
  }

  initEventListeners() {
    const {thumbLeft, thumbRight} = this.subElements;
    thumbLeft.addEventListener('pointerdown', this.onThumbPointerDown);
    thumbRight.addEventListener('pointerdown', this.onThumbPointerDown);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  onThumbPointerDown = (event) => {
    const thumbElem = event.target;
    event.preventDefault();
    const {left, right} = thumbElem.getBoundingClientRect();
    if (thumbElem === this.subElements.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }
    this.dragging = thumbElem;
    this.element.classList.add('range-slider_dragging');
    document.addEventListener('pointermove', this.onThumbPointerMove);
    document.addEventListener('pointerup', this.onThumbPointerUp);
  };

  onThumbPointerMove = event => {
    event.preventDefault();
    const {left: innerLeft, right: innerRight, width} = this.subElements.inner.getBoundingClientRect();
    if (this.dragging === this.subElements.thumbLeft) {
      let newLeft = (event.clientX - innerLeft + this.shiftX) / width;
      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;
      let right = parseFloat(this.subElements.thumbRight.style.right);
      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }
      this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
      this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
    }
    if (this.dragging === this.subElements.thumbRight) {
      let newRight = (innerRight - event.clientX - this.shiftX) / width;
      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;
      let left = parseFloat(this.subElements.thumbLeft.style.left);
      if (left + newRight > 100) {
        newRight = 100 - left;
      }
      this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
      this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
    }
  };

  onThumbPointerUp = () => {
    this.element.classList.remove('range-slider_dragging');
    document.removeEventListener('pointermove', this.onThumbPointerMove);
    document.removeEventListener('pointerup', this.onThumbPointerUp);
    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    }));
  };

  getValue() {
    const rangeTotal = this.max - this.min;
    const {left} = this.subElements.thumbLeft.style;
    const {right} = this.subElements.thumbRight.style;
    const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);
    return {from, to};
  }

}
