export enum Events {
  CLOSE = 'modal:close',
  OPEN = 'modal:open',
  BUY = 'item:buy',
  DELETE = 'basket:delete',
  PAY = 'basket:pay',
  NEXT = 'payment:next',
  CONFIRM = 'contacs:confirm',
  SUCCESS = 'success:complete'
}

export enum Categories {
  'софт-скил' = '#83FA9D',
  'другое' = '#FAD883',
  'хард-скил' = '#FAA083',
  'кнопка' = '#83DDFA',
  'дополнительное' = '#B783FA'
}

export interface IItem {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export type TMainItemInfo = Pick<IItem, '_id' | 'title' | 'image' | 'category' | 'price'> 

export type TItemInfo = Pick<IItem, '_id' | 'title' | 'price'> 

export type TPayInfo = {
  card: boolean,
  cash: boolean,
  address: string,
}

export type TContacts = {
  email: string,
  phone: string,
}

export type TUserData = TPayInfo & TContacts

export interface IItemsApi {
  getItems: () => Promise<IItem[]>;
}

export interface IItemData {
  items: IItem[];
  updateState(itemId: string): void;
  getItem(itemId: string): IItem;
  hasPrice(price: string): void;
}

export interface IBasketData {
  items: TItemInfo[];
  totalizeBasket(items: TItemInfo[]): number;
  numerateBasket(items: TItemInfo[]): string;
  deleteItem(itemId: string): void;
  addItem(itemId: string): TItemInfo;
  hasItems(): void;
}

export interface IForm {
  userData: TUserData;
  showErrors(errors: string): void;
  checkValid(data: string): void;
}

export interface IModal {
  modal: HTMLElement;
  close: () => void;
  open: () => void;
  render<T>(content: T): HTMLElement;
}

export interface IItemPreview {
  image: HTMLImageElement;
  category: HTMLSpanElement;
  title: HTMLHeadingElement;
  description: HTMLParagraphElement;
  addButton: HTMLButtonElement;
  price: HTMLSpanElement;
}

export interface IBasketView {
  submitButton: HTMLButtonElement;
  handleSumbit: Function;
}

export interface IPaymentView {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  handleSubmit: Function;
}

export interface IContactsView {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  handleSubmit: Function;
}

export interface ISuccessView {
  closeButton: HTMLButtonElement;
}

export interface IItemView {
  template: HTMLTemplateElement;
  render(): HTMLElement;
}