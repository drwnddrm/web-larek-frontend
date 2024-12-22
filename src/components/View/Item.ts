import { Events, IItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Item extends Component<IItem> {
  protected itemTitle: HTMLElement
  protected itemPrice: HTMLElement
  protected itemId: string
  protected _description: string
  protected _price: number

  protected itemImage?: HTMLImageElement
  protected itemCategory?: HTMLElement
  protected itemDescription?: HTMLElement
  protected itemIndex?: HTMLElement

  protected button?: HTMLButtonElement

  constructor(protected container: HTMLElement, protected events: IEvents, check?: boolean) {
    super(container)
    
    this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container)
    this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container)
    
    this.itemImage = this.container.querySelector('.card__image')
    this.itemCategory = this.container.querySelector('.card__category')
    this.itemDescription = this.container.querySelector('.card__text')
    this.itemIndex = this.container.querySelector('.basket__item-index')

    this.button = this.container.querySelector('.card__button')
    
    if(this.button && !this.button.classList.contains('basket__item-delete')) {
      this.toggleButton(check)
    } else if(this.button) {
      this.button.addEventListener('click', () => {
        this.events.emit(Events.DELETE, { item: this })
      })
    } else {
      this.container.addEventListener('click', () => {
        this.events.emit(Events.SELECT, { item: this })
      })
    }
  }

  get category() {
    if(this.itemCategory) return this.itemCategory.textContent
  }

  set category(category: string) {
    if(this.itemCategory) {
      this.itemCategory.textContent = category
      switch(category) {
        case 'софт-скил':
          this.itemCategory.classList.add(`card__category_soft`)
          break
        case 'другое':
          this.itemCategory.classList.add(`card__category_other`)
          break
        case 'хард-скил':
          this.itemCategory.classList.add(`card__category_hard`)
          break
        case 'кнопка':
          this.itemCategory.classList.add(`card__category_button`)
          break
        case 'дополнительное':
          this.itemCategory.classList.add(`card__category_additional`)
          break
      }
    }
  }

  get price() {
    return this._price
  }

  set price(price: number) {
    this._price = price
    if (price === null) {
      !this.button ? '' : this.button.disabled = true
      this.itemPrice.textContent = `Бесценно`
    } else {
      !this.button ? '' : this.button.disabled = false
      this.itemPrice.textContent = this.decoratePrice(price)
    }
  }

  get image() {
    if(this.itemImage) return this.itemImage.src
  }

  set image(image: string) {
    if(this.itemImage) {
      this.itemImage.src = image
    }
  }

  get title() {
    return this.itemTitle.textContent
  }

  set title(title: string) {
    this.itemTitle.textContent = title
  }
  
  get description() {
    if(this.itemDescription) return this.itemDescription.textContent
    return this._description
  }

  set description(desc: string) {
    this._description = desc
    if(this.itemDescription) {
      this.itemDescription.textContent = desc
    }
  }

  set index(i: number) {
    if(this.itemIndex) {
      this.itemIndex.textContent = `${i}`
    }
  }

  get id() {
    return this.itemId
  }

  set id(id: string) {
    this.itemId = id
  }

  protected toggleButton(check: boolean): void {
    if(check) {
      this.button.textContent = 'Убрать'
      this.button.addEventListener('click', () => {
        this.events.emit(Events.DELETE_IN_PREVIEW, { item: this })
      })
    } else {
      this.button.textContent = 'Купить'
      this.button.addEventListener('click', () => {
        this.events.emit(Events.BUY, { item: this })
      })
    }
  }
}