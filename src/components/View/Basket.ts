import { Events } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
  items: HTMLElement[]
  summary: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _summary: HTMLElement;
  protected _buyButton: HTMLButtonElement;
  protected _sum: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)
    
    this._list = ensureElement<HTMLElement>('.basket__list', this.container)
    this._summary = ensureElement<HTMLElement>('.basket__price', this.container)
    this._buyButton = ensureElement<HTMLButtonElement>('.basket__button', this.container)

    this._buyButton.addEventListener('click', () => {
      events.emit(Events.PAY)
    })
    
    this.items = []
  }

  set items(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  set summary(sum: number | undefined) {
    if(sum === undefined || sum === 0) {
      this._summary.textContent = `Корзина пуста`
    } else {
      this._sum = this.decoratePrice(sum)
      this._summary.textContent = this._sum
    }
  }

  get sum() {
    return this._sum
  }

  lock(length: number): void {
    if(length === 0) {
      this._buyButton.disabled = true
    } else {
      this._buyButton.disabled = false
    }
  }
}