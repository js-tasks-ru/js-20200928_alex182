export default class NotificationMessage {
  element;
  static activeElement;

  constructor(title = '', {duration = 0, type = 'success'} = {}) {
    this.title = title;
    this.duration = duration;
    this.type = type;
    if (NotificationMessage.activeElement) {
      NotificationMessage.activeElement.remove();
    }
    this.initElement();
  }

  get template() {
    return `
    <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">${this.title}</div>
        </div>
    </div>
`;
  }

  initElement() {
    const createdElement = document.createElement('div');
    createdElement.innerHTML = this.template;
    this.element = createdElement.firstElementChild;
  }

  show(element = document.body) {
    element.append(this.element);
    NotificationMessage.activeElement = this.element;
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
