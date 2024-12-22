import { IApi, IItemsApi } from "../types";


export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  getItems(): Promise<IItemsApi> {
    return this._baseApi.get<IItemsApi>('/product/').then((items: IItemsApi) => items);
  }
}