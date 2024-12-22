import { Events } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPage {
  counter: number;
  gallery: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _gallery: HTMLElement;
  protected _basket: HTMLElement;
  protected _wrapper: HTMLElement;
  
  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)
    
    this._counter = ensureElement<HTMLElement>('.header__basket-counter')
    this._gallery = ensureElement<HTMLElement>('.gallery')
    this._basket = ensureElement<HTMLElement>('.header__basket')
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper')

    this._basket.addEventListener('click', () => {
      this.events.emit(Events.BASKET_OPEN);
    })
  }

  set counter(total: number) {
    this._counter.textContent = `${total}`;
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items)
  }

  set locked(lock: boolean) {
    if (lock) {
      this._wrapper.classList.add('page__wrapper_locked')
    } else {
      this._wrapper.classList.remove('page__wrapper_locked')
    }
  }
}