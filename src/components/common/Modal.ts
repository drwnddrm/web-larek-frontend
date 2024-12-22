import { Events } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container)
    this._content = ensureElement<HTMLElement>('.modal__content', container)

    this._closeButton.addEventListener('click', this.close.bind(this))
    this.container.addEventListener('click', this.close.bind(this))
    this._content.addEventListener('click', e => e.stopPropagation())
  }

  set content(content: HTMLElement) {
    this._content.replaceChildren(content)
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit(Events.OPEN)
  }

  close() {
    this.container.classList.remove('modal_active')
    this.content = null;
    this.events.emit(Events.CLOSE)
  }

  render(data: IModalData): HTMLElement {
    super.render(data)
    this.open()
    return this.container
  }
}