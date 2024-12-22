import { Events, IForm, TContacts } from "../../types";
import { ERRORS, REGEX } from "../../utils/constants";
import { IEvents } from "../base/events";

export class FormData implements IForm {
  protected _card: boolean
  protected _cash: boolean
  protected _address: string
  protected _email: string
  protected _phone: string

  constructor(protected events: IEvents) {}

  set card(value: boolean) {
    this._card = value
  }

  set cash(value: boolean) {
    this._cash = value
  }

  set address(value: string) {
    this._address = value
  }
  
  set email(value: string) {
    this._email = value
  }
  
  set phone(value: string) {
    this._phone = value
  }

  updateFields(field: keyof TContacts, value: string): void {
    this[field] = value

    let valid: string | undefined

    switch (field) {
      case 'address':
        valid = !this.checkPaymentValidation() ? undefined : ERRORS.address
        break
      case 'email':
        valid = !this.checkEmailValidation() ? undefined : ERRORS.email
        break
      case 'phone':
        valid = !this.checkPhoneValidation() ? undefined : ERRORS.phone
        break
    }
    
    if(valid === undefined) {
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

  checkPaymentValidation(): string | undefined {
    if(!REGEX.address.test(this._address)) {
      return ERRORS.address
    }

    return undefined
  }

  checkEmailValidation(): string | undefined {
    if(!REGEX.email.test(this._email)) {
      return ERRORS.email
    }
    
    return undefined
  }

  checkPhoneValidation(): string | undefined {
    if(!REGEX.phone.test(this._phone)) {
      return ERRORS.phone
    }

    return undefined
  }

  clearForm(): void {
    this._card = false
    this._cash = true
    this._address = ''
    this._email = ''
    this._phone = ''
  }
}