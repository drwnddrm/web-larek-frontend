import { Events, IBasketData, IItem } from "../../types";
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {
  protected _items: Partial<IItem>[];
  protected _count: number;
  protected _summary: number;

  constructor(protected events: IEvents) {
    this._items = [];
  }

  get items() {
    return this._items
  }

  get count() {
    return this._count
  }
  
  get summary() {
    return this._summary
  }

  updateState(): void {
    this.numerateBasket();
    this.totalizeBasket();
  }

  deleteItem(itemId: string): void {
    if(this.hasItems()) {
      this._items = this._items.filter(item => item.id !== itemId)
      this.events.emit(Events.BASKET_CHANGE)
    }
  }
  
  addItem(item: Partial<IItem>): void {
    if(this.hasItems()) {
      this._items = [item, ...this._items]
    } else {
      this._items = [item]
    }
    this.events.emit(Events.BASKET_CHANGE)
  }

  isInBasket(itemId: string): boolean {
    if(this.hasItems()){
      return this._items.some(item => item.id === itemId)
    }
    return false
  }

  protected hasItems(): boolean {
    return !!this._items.length
  }

  protected numerateBasket(): void {
    if(this.hasItems()) {
      this._count = this._items.length
    } else {
      this._count = 0
    }
  }

  protected totalizeBasket(): void {
    if(this.hasItems()) {
      this._summary = this._items.reduce((acc, curr) => acc + curr.price, 0)
    } else {
      this._summary = 0;
    }
  }
}