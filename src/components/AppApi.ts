import { IApi, IItemsApi, IOrder, IOrderApi } from "../types";


export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getItems(): Promise<IItemsApi> {
    return this._baseApi.get<IItemsApi>('/product/').then((items: IItemsApi) => items);
  }

  postOrder(order: IOrder): Promise<IOrderApi> {
    return this._baseApi.post<IOrderApi>('/order', order).then((data: IOrderApi) => data);
  }
}