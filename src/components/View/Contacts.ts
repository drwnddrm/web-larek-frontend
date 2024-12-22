import { Events } from "../../types";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export class Contacts extends Form {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container, events)

    this.emailInput = this.container.querySelector('input[name="email"]')
    this.phoneInput = this.container.querySelector('input[name="phone"]')
    
    this.container.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;

      this.events.emit(Events.CONTACTS, {name: input.name, value: input.value})
    })

    this.container.addEventListener('submit', (e) => {
      e.preventDefault()
      this.events.emit(Events.CONFIRM)
    })
  }

  set email(email: string) {
    this.emailInput.value = email
  }

  set phone(phone: string) {
    this.phoneInput.value = phone
  }

  lock(): void {
    if(this.emailInput.value === '' || this.phoneInput.value === '') {
      this.submitButton.disabled = true
    } else {
      this.submitButton.disabled = false
    }
  }

  clearForm(): void {
    this.phoneInput.value = ''
    this.emailInput.value = ''
    this.errorForm.textContent = ''
    this.submit = true
  }
}