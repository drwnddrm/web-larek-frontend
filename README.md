# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

Товар

```
interface IItem {
  _id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

Информация о товаре для главной страницы

```
type TMainItemInfo = Pick<IItem, '_id' | 'title' | 'image' | 'category' | 'price'>  
```

Информация о товаре для корзины

```
type TItemInfo = Pick<IItem, '_id' | 'title' | 'price'> 
```

Информация для модального окна с выбором способа оплаты и указанием адреса доставки

```
type TPayInfo = {
  card: boolean,
  cash: boolean,
  address: string,
}
```

Информация для модального окна с указанием контактных данных

```
type TContacts = {
  email: string,
  phone: string,
}
```

Объединение типов для хранения пользовательских данных

```
export type TUserData = TPayInfo & TContacts
```

## Архитектура приложения

Код приложения разделен на слои согласно паттерну "Наблюдатель":

- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- брокер событий, отвечает за подписание на события и за уведомление о отправку событий.

### Базовый код

#### Класс `Api`

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опицональный объект с заголовками запросов. Методы:

- `get` — выполняет __GET__ запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` — принимает объект с данными, которые будут переданы в __JSON__ в теле запроса, и отправляет эти данные на едпоинт переданный как параметр при вызове метода. По умолчанию выполяется __POST__ запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс `EventEmitter`

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в для обработки событий и в слоях приложения для генерации событий. Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` — используется для подписание на событие;
- `emit` — позволяет уведомлять подписчиков о наступлении события;
- `trigger` — используется для генерации заданного события с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса `EventEmitter`;

Дополнительные методы, реализованные в классе `EventEmitter`:

- `off` — используется для отписки от события;
- `onAll` — используется для подписки на все события;
- `offAll` — используется метод для сброса всех подписчиков.

### Компоненты модели данных

#### Класс ItemData

Класс `ItemData` отвечает за хранение и работу с данными товара.\
Конструктор класса принимает инстант брокера событий. 
Поля класса хранят данные:
- `_items: IItem[]` — массив объектов товаров;
- `events: IEvents` — экземпляр класса `EventEmitter` для работы с событиями при изменении данных.

В классе реализованы следующие методы для работы с данными:

- `updateState(itemId: string): void` — метод используется для обновление состояния карточки, а именно обновлять состояние при добавлении и удалении из корзины.
- `getItem(itemId: string): IItem` — метод, который позволяет получить товар по id.
- `hasPrice(price: string): void` — метод проверяет есть ли цена у товара.

Также в классе реализованы сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс BasketData

Класс `BasketData` отвечает за хранение и работу с данными корзины.\
Конструктор класса принимает инстант брокера событий. 
Поля класса хранят данные:
- `_items: TItemInfo[]` — массив объектов добавленных в корзину товаров;
- `events: IEvents` — экземпляр класса `EventEmitter` для работы с событиями при изменении данных.

В классе реализованы следующие методы для работы с данными:

- `totalizeBasket(items: TItemInfo[]): number` — метод предназначен для суммирования цены всех выбранных товаров в корзине.
- `numerateBasket(items: TItemInfo[]): string` — метод для нумерации списка товаров.
- `deleteItem(itemId: string): void` — метод, позволяющий удалять товары из корзины.
- `addItem(itemId: string): TItemInfo` — метод, позволяющий добавлять товар в корзину.
- `hasItems(): void` - метод, который проверяет наличие бесценного товара в корзине. Если корзина пуста, то делает кнопку __Оформить__ неактивной.

Также в классе реализованы сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс Form

Класс `Form` отвечает за работу с формами, с хранением данных с форм и валидацией их.

В классе содержатся поле хранения данных `userData` типа `TUserData`.

Также в классе содержится методы `checkValid(data: string): void` проверящий на правильность заполнения формы и `showErrors(errors: string): void` показывающий ошибки в форме.

### Компоненты представления

Все классы представления нужны для отображения передаваемых данных внутри DOM-элементах.

#### Класс Modal

Класс реализует модальное окно. В классе есть методы `open` и `close` для управления видимости модального окна.\
Конструктор принимает селектор, по которому в разметке страницы будет найдено модальное окно и экземпляр класса `EventEmitter` для инициации событий `constructor(selector: string, events: IEvents)`.

В классе содержатся поля:
- `modal: HTMLElement` — элемент модального окна;
- `events: IEvents` — брокер событий.

Содержит метод:
- `render<T>(content: T): HTMLElement` — метод рендер позволяет вкладывать в модальное окно определенный контент, например: корзины, формы или товара.

#### Класс BasketView

Предназначен для отображения модального окна корзины.

Содержит такие поля класса как:
- `submitButton: HTMLButtonElement` — кнопка сабмита.
- `handleSumbit: Function` — функция, на выполнение которой нужен сабмит.

#### Класс ItemPreview

Предназначен для отображения модального окна с информацией о товаре.

Содержит поля класса:
- `image: HTMLImageElement` — элемент отображения картинки товара;
- `category: HTMLSpanElement` — элемент отображения категории товара;
- `title: HTMLHeadingElement` — элемент отображения названия товара;
- `description: HTMLParagraphElement` — элемент отображения описания товара;
- `price: HTMLSpanElement` — элемент отображения цены товара
- `addButton: HTMLButtonElement` —  кнопка добавление товара в корзину.

Содержит метод:


#### Класс PaymentView

Предназначен для отображения модального окна формы заполнения способа оплаты и адреса доставки.

Содержит такие поля класса как:
- `form: HTMLFormElement` — элемент формы для работы с формой.
- `submitButton: HTMLButtonElement` — кнопка сабмита.
- `handleSumbit: Function` — функция, на выполнение которой нужен сабмит.

#### Класс ContactsView

Предназначен для отображения модального окна формы заполнения контактных данных покупателя.

Содержит такие поля класса как:
- `form: HTMLFormElement` — элемент формы для работы с формой.
- `submitButton: HTMLButtonElement` — кнопка сабмита.
- `handleSumbit: Function` — функция, на выполнение которой нужен сабмит.

#### Класс SuccessView

Предназначен для отображения модального окна сообщающий о успешном совершении покупки.

Содержит такие поля класса как:
- `closeButton: HTMLButtonElement` — кнопка закрытия модального окна.

#### Класс Item

Отвечает за отображение товара на странице. В конструкторе класса передается темплейт товара. Также конструктор принимает экземпляр класса `EventEmitter`. для работы с событиями.

Класс содержит метод `render(): HTMLElement` — возвращает полностью заполненную разметку товара с установленными слушателями.

## Взаимодействие компонентов

Код, описанный в файле `index.ts`, будет выполнять роль наблюдателя, который описывает взаимодействие между представлением и данными.

Взаимодействия выполняются благодаря генерации событий и их обработчиков.\
В файле `index.ts` сначала создаются все необходимые экземпляры классов, а после уже настраиваются обработка событий.

Все события

```
enum Events {
  CLOSE = 'modal:close', // закрытие модального окна
  OPEN = 'modal:open', // открытие модального окна
  BUY = 'item:buy', // событие покупки товара и последующее добавление в корзину
  DELETE = 'basket:delete', // удаление товара из корзины
  PAY = 'basket:pay', // событие открытия модального окна оплаты
  NEXT = 'payment:next', // событие открытия модального окна контакты
  CONFIRM = 'contacs:confirm', // событие открытия модального окна успешной покупки
  SUCCESS = 'success:complete' // событие завершение покупки и закрытие модального окна успешной покупки
}
```

Все категории с заданными цветами, для отображения в DOM-элементах

```
enum Categories {
  'софт-скил' = '#83FA9D', 
  'другое' = '#FAD883',
  'хард-скил' = '#FAA083',
  'кнопка' = '#83DDFA',
  'дополнительное' = '#B783FA'
}
```