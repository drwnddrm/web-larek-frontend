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
}

export interface IBasketData {
  items: TItemInfo[];
  totalizeBasket(items: TItemInfo[]): number;
  numerateBasket(items: TItemInfo[]): string;
  deleteItem(itemId: string): void;
}

export interface IModal {
  modal: HTMLElement;
  close: () => void;
  open: () => void;
}

export interface IBasketModal extends IModal {
  submitButton: HTMLButtonElement;
  handleSumbit: Function;
  hasItems(): void;
}

export interface IItemModal extends IModal {
  addButton: HTMLButtonElement;
}

export interface IPaymentModal extends IModal {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  handleSubmit: Function;
}

export interface IContactsModal extends IModal {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  handleSubmit: Function;
}

export interface ISuccessModal extends IModal {
  closeButton: HTMLButtonElement;
}

export interface IItemView {
  template: HTMLTemplateElement;
  render(): HTMLElement;
}