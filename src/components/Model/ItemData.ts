import { Events, IItem, IItemData } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/events";

export class ItemData implements IItemData {
  protected _items: IItem[];

  constructor(protected events: IEvents) {}

  get items() {
    return this._items;
  }
  
  set items(items: IItem[]) {
    this._items = items;
    this._items.forEach((item) => {
      item.image = `${CDN_URL + item.image}`
    })
    this.events.emit(Events.INITIAL_LOADED)
  }

  getItem(itemId: string): IItem {
    return this._items.find(item => item.id === itemId)
  }

  hasPrice(item: IItem): boolean {
    return item.price !== null
  }
}