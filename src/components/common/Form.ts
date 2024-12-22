import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IForm {
  error: string
}

export class Form extends Component<IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorForm: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)

    this.errorForm = this.container.querySelector('.form__errors')
    this.submitButton = this.container.querySelector('.button[type="submit"]')

    this.submitButton.disabled = true
  }

  set submit(value: boolean) {
    this.submitButton.disabled = value
  }

  set error(value: string) {
    this.errorForm.textContent = value
  }
}