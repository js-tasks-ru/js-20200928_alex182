class Tooltip {
  element;
  static instance;

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }
    return Tooltip.instance;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.removeEventListeners();
  }

  render(dataTooltip) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = dataTooltip;
    document.body.append(this.element);
  }

  initialize() {
    this.initEventListeners();
  }

  onPointerOver = event => {
    const dataTooltip = event.target.closest('[data-tooltip]');
    if (!dataTooltip) {
      return;
    }
    this.render(dataTooltip.dataset.tooltip);
    this.moveTooltip(event);
    document.addEventListener('pointermove', this.onPointerMove);
  };

  onPointerOut = () => {
    if (!this.element) {
      return;
    }
    this.element.remove();
    this.element = null;
    document.removeEventListener('mousemove', this.onPointerMove);
  };

  initEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  removeEventListeners() {
    document.removeEventListener('pointerout', this.onPointerOut);
    document.removeEventListener('pointerover', this.onPointerOver);
  }

  moveTooltip(event) {
    const left = event.clientX + 10;
    const top = event.clientY + 10;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  onPointerMove = (event) => {
    this.moveTooltip(event);
  };
}

const tooltip = new Tooltip();

export default tooltip;
