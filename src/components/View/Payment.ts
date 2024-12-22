import { Events } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export class Payment extends Form {
  protected cardRadio: HTMLButtonElement
  protected cashRadio: HTMLButtonElement
  protected addressInput: HTMLInputElement

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events)

    this.cardRadio = this.container.querySelector('button[name="card"]')
    this.cashRadio = this.container.querySelector('button[name="cash"]')
    this.addressInput = this.container.querySelector('input[name="address"]')

    this.cashRadio.classList.toggle('button_alt-active')

    this.container.addEventListener('submit',(e) => {
      e.preventDefault();
      this.events.emit(Events.NEXT)
    })

    this.addressInput.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;

      this.events.emit(Events.ADDRESS, { name: input.name, value: input.value})
    })

    this.cardRadio.addEventListener('click', () => {
      this.events.emit(Events.PAYMENT, { payment: 'card'})
    })

    this.cashRadio.addEventListener('click', () => {
      this.events.emit(Events.PAYMENT, { payment: 'cash'})
    })
  }

  toggleButtons(payment: string): void {
    switch (payment) {
      case 'cash':
        this.cardRadio.classList.toggle('button_alt-active')
        this.cashRadio.classList.toggle('button_alt-active')
        break
      case 'card':
        this.cashRadio.classList.toggle('button_alt-active')
        this.cardRadio.classList.toggle('button_alt-active')
        break
    }
  }

  set address(addr: string) {
    this.addressInput.value = addr
  }

  clearForm(): void {
    this.addressInput.value = ''
    this.errorForm.textContent = ''
    this.submit = true
  }
}