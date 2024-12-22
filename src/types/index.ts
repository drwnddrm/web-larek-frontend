export enum Events {
  INITIAL_LOADED = 'initialData:loaded',
  BUY = 'item:buy',
  SELECT = 'item:select',
  DELETE = 'item:delete',
  DELETE_IN_PREVIEW = 'itemPreview:delete',
  ITEM_OPEN = 'item:open',
  BASKET_OPEN = 'basket:open',
  BASKET_CHANGE = 'basket:change',
  PAY = 'basket:pay',
  PAYMENT = 'payment:change',
  ADDRESS = 'address:change',
  NEXT = 'payment:next',
  CONTACTS = 'contacts:change',
  CONFIRM = 'contacs:confirm',
  SUCCESS = 'success:complete',
  ERROR = 'form:error',
  VALID = 'form:valid',
  OPEN = 'modal:open',
  CLOSE = 'modal:close'
}

export interface IItem {
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number
  index: number
}

export type TContacts = {
  address: string,
  email: string,
  phone: string
}

export interface IItemsApi {
  total: number
  items: IItem[]
}

export interface IItemData {
  items: IItem[]
  getItem(itemId: string): IItem
  hasPrice(item: IItem): boolean
}

export interface IBasketData {
  items: Partial<IItem>[]
  updateState(): void
  deleteItem(itemId: string): void
  addItem(item: Partial<IItem>): void
}

export interface IApi {
  baseUrl: string
  get<T>(url: string): Promise<T>
}

export interface IForm {
  card: boolean,
  cash: boolean,
  address: string,
  email: string,
  phone: string
}