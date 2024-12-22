import { Events } from "../../types";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface ISuccess {
  total: string;
}

export class Success extends Component<ISuccess> {
  protected itemSum: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)

    this.itemSum = this.container.querySelector('.order-success__description')
    this.successButton = this.container.querySelector('.order-success__close')
  
    this.successButton.addEventListener('click', () => {
      this.events.emit(Events.SUCCESS)
    })
  }

  set total(sum: string) {
    this.itemSum.textContent = 'Списано ' + sum
  }
}