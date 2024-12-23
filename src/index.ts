import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Page } from './components/common/Page';
import { BasketData } from './components/Model/BasketData';
import { FormData } from './components/Model/FormData';
import { ItemData } from './components/Model/ItemData';
import { Basket } from './components/View/Basket';
import { Contacts } from './components/View/Contacts';
import { Item } from './components/View/Item';
import { Payment } from './components/View/Payment';
import { Success } from './components/View/Success';
import './scss/styles.scss';
import { Events, IApi, TPayment } from './types';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const baseApi: IApi = new Api(API_URL, settings)
const api = new AppApi(baseApi)

const events = new EventEmitter()

//Все необходимые шаблоны
const itemGalleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog')
const itemPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview')
const itemBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket')
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket')
const orderTemplate = ensureElement<HTMLTemplateElement>('#order')
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts')
const successTemplate = ensureElement<HTMLTemplateElement>('#success')

const page = new Page(document.body, events)
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)

const formData = new FormData(events)
const itemsData = new ItemData(events)
const basketData = new BasketData(events)

const basket = new Basket(cloneTemplate(basketTemplate), events)
const payment = new Payment(cloneTemplate(orderTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsTemplate), events)
const success = new Success(cloneTemplate(successTemplate), events)

//Для отладки всех событий
events.onAll((event) => {
	console.log(event.eventName, event.data)
})

//Событие загрузки данных в галлерею
events.on(Events.INITIAL_LOADED, () => {
	page.gallery = itemsData.items.map((item) => {
		const itemInstant = new Item(
      cloneTemplate(itemGalleryTemplate), 
      events
    )

		return itemInstant.render({
      id: item.id,
      image: item.image,
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
    })
	})
})

//Событие выбора предмета для открытия его модального окна превью
events.on(Events.SELECT, (data: { item: Item }) => {
	const itemPreview = new Item(
		cloneTemplate(itemPreviewTemplate),
		events,
    basketData.isInBasket(data.item.id)
	)

  modal.render({
		content: itemPreview.render({
			id: data.item.id,
			description: data.item.description,
			image: data.item.image,
			title: data.item.title,
			category: data.item.category,
			price: data.item.price,
		}),
	})
})

//Событие покупки, добавление в корзину предмета
events.on(Events.BUY, (data: { item: Item }) => {
	basketData.addItem(data.item)

	page.counter = basketData.count
	modal.close()
})

//Событие открытия корзины
events.on(Events.BASKET_OPEN, () => {
  modal.render({
		content: basket.render({
			summary: basketData.summary,
		}),
	})
})

events.on(Events.BASKET_CHANGE, () => {
  basketData.updateState()
  basket.lock(basketData.items.length)

	basket.items = basketData.items.map((item, i) => {
		const itemBasket = new Item(
			cloneTemplate(itemBasketTemplate),
			events
		)

		return itemBasket.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: i + 1,
		})
	})

	basket.render({
		summary: basketData.summary,
	})
})

//События удаления предмета из корзины внутри корзины
events.on(Events.DELETE, (data: { item: Item }) => {
	basketData.deleteItem(data.item.id)

	page.counter = basketData.count

  if(data.item.description) {
    modal.close()
  }
})

//Событие рендера модального окна выбора способов оплаты и адреса доставки
events.on(Events.PAY, () => {
  modal.render({
    content: payment.render({})
  })
})

//Событие изменение способа оплаты
events.on(Events.PAYMENT, ( data: {payment: TPayment} ) => {
  console.log(data.payment)
  formData.payment = data.payment

  payment.toggleButtons(data.payment)
})

//Событие проверки валидного значения в инпуте адреса доставки
events.on(Events.ADDRESS, (data: {name: string, value: string}) => {
  formData.address = data.value

  formData.updateFields('address', data.value)
})

//Событие открытие модального окна контактов
events.on(Events.NEXT, () => {
  modal.render( {
    content: contacts.render({})
  })
})

//Событие проверки валидных значений в полях инпутов в контактах
events.on(Events.CONTACTS, (data: {name: string, value: string}) => {
  switch (data.name) {
    case 'email':
      formData.email = data.value  
      formData.updateFields(data.name, data.value)
      break
    case 'phone':
      formData.phone = data.value
      formData.updateFields(data.name, data.value)
      break
  }
})

//Событие рендера модального окна успешной покупки
events.on(Events.CONFIRM, () => {
  api.postOrder( {
    payment: formData.payment ? formData.payment : 'cash',
    address: formData.address,
    email: formData.email,
    phone: formData.phone,
    items: basketData.items.map(item => item.id),
    total: basketData.summary
  })
  .then(res => {
    basketData.deleteAll()
    formData.clearForm()
    payment.clearForm()
    contacts.clearForm()
  
    page.counter = basketData.count
    
    modal.render({
      content: success.render({
        total: basket.sum
      })
    })
  })
  .catch(err => {
    console.error(err)
  })
  
})

//Событие нажатия кнопки успешной покупки
events.on(Events.SUCCESS, () => {
  modal.close()
})

//Событие по работе с ошибками в полях инпутов
events.on(Events.ERROR, (data: {name: string, error: string}) => {
  switch (data.name) {
    case 'address':
      payment.submit = true
      payment.error = data.error
      break
    case 'phone':
    case 'email':
      contacts.submit = true
      contacts.error = data.error
      break
  }
})

//Событие прохождение валидатора в полях инпутов
events.on(Events.VALID, (data: {name: string}) => {
  switch (data.name) {
    case 'address':
      payment.error = ''
      payment.submit = false
      break
    case 'phone':
    case 'email':
      contacts.lock()
      contacts.error = ''
      break
  }
})

//Событие открытия любых модальных окон и запрет прокрутки страницы
events.on(Events.OPEN, () => {
	page.locked = true
})

//Событие открытия любых модальных окон и снятие запрета прокрутки страницы
events.on(Events.CLOSE, () => {
  page.locked = false
})

//Получение данных с сервера
api
	.getItems()
	.then((initialData) => {
		itemsData.items = initialData.items
	})
	.catch((err) => console.error(err))


// const user = {
//   address: '143004, Москва, ул. Пушкина, д. 4, стр. 1, кв. 44',
//   email: 'kirill6744@yandex.ru',
//   phone: '+79005544400'
// }