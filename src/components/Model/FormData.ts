import { Events, IUserData, TContacts, TPayment } from "../../types";
import { ERRORS, REGEX } from "../../utils/constants";
import { IEvents } from "../base/events";

export class FormData implements IUserData {
  protected _payment: TPayment
  protected _address: string
  protected _email: string
  protected _phone: string

  constructor(protected events: IEvents) {}

  get payment() {
    return this._payment
  }

  set payment(value: TPayment) {
    this._payment = value
  }

  get address() {
    return this._address
  }

  set address(value: string) {
    this._address = value
  }

  get email() {
    return this._email
  }
  
  set email(value: string) {
    this._email = value
  }

  get phone() {
    return this._phone
  }
  
  set phone(value: string) {
    this._phone = value
  }

  updateFields(field: keyof TContacts, value: string): void {
    this[field] = value

    let valid: string

    switch (field) {
      case 'address':
        valid = !this.checkPaymentValidation() ? '' : ERRORS.address
        break
      case 'email':
        valid = !this.checkEmailValidation() ? '' : ERRORS.email
        break
      case 'phone':
        valid = !this.checkPhoneValidation() ? '' : ERRORS.phone
        break
    }
    
    if(valid.length === 0) {
      this.events.emit(Events.VALID, {
        name: field
      })
    } else {
      this.events.emit(Events.ERROR, {
        name: field,
        error: valid,
      })
    }
  }

  checkPaymentValidation(): string {
    if(!REGEX.address.test(this._address)) {
      return ERRORS.address
    }

    return ''
  }

  checkEmailValidation(): string {
    if(!REGEX.email.test(this._email)) {
      return ERRORS.email
    }
    
    return ''
  }

  checkPhoneValidation(): string {
    if(!REGEX.phone.test(this._phone)) {
      return ERRORS.phone
    }

    return ''
  }

  clearForm(): void {
    this._payment = 'cash'
    this._address = ''
    this._email = ''
    this._phone = ''
  }
}