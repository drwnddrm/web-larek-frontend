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
  id: string
  description: string
  image: string
  title: string
  category: string
  price: number
  index: number
}
```

Тип для хранения введенных пользовательских данных

```
type TContacts = {
  address: string,
  email: string,
  phone: string
}
```

Тип выбора способа оплаты

```
type TPayment = 'card' | 'cash'
```

Пользовательские данные

```
interface IUserData {
  payment: TPayment,
  address: string,
  email: string,
  phone: string
}
```

## Архитектура приложения

Код приложения разделен на слои согласно MVP:

- слой представления, отвечает за отображение данных на странице;
- слой данных, отвечает за хранение и изменение данных;
- презентер, отвечает за связь между представлением и данными.

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

- `getItem(itemId: string): IItem` — метод, который позволяет получить товар по id;
- `hasPrice(item: IItem): boolean` — метод проверяет есть ли цена у товара.

Также в классе реализованы сеттер и геттер для сохранения и получения массива данных товаров из полей класса.

#### Класс BasketData

Класс `BasketData` отвечает за хранение и работу с данными корзины.\
Конструктор класса принимает инстант брокера событий.\ 
Поля класса хранят данные:
- `_items: Partial<IItem>[]` — массив объектов добавленных в корзину товаров;
- `_count: number` — счетчик количества объектов в корзине;
- `_summary: number` — общая сумма всех объектов в корзине;
- `events: IEvents` — экземпляр класса `EventEmitter` для работы с событиями при изменении данных.

В классе реализованы следующие методы для работы с данными:

- `updateState(): void` — метод, обновляющий поля `_count` и `_summary`;
- `deleteItem(itemId: string): void` — метод, позволяющий удалить товар из корзины;
- `addItem(item: Partial<IItem>): void` — метод, позволяющий добавить товар в корзину;
- `isInBasket(itemId: string): boolean` — метод, который проверяет есть ли товар в корзине;

Также в классе реализованы геттеры для получения данных из полей класса, таких как `items`, `count`, `summary`.

#### Класс FormData

Класс `FormData` отвечает за работу с данными в формах.\
Конструктор класса принимает инстант брокера событий.\

Поля класса:
- `_payment: TPayment` — хранит значение выбора способа оплаты;
- `_address: string` — адрес доставки;
- `_email: string` — электронная почта;
- `_phone: string` — номер телефона;
- `events: IEvents` — экземпляр класса `EventEmitter` для работы с событиями при изменении данных.

В классе реализованы методы:
- `updateFields(field: keyof TContacts, value: string): void` — метод для обновления полей и проверки их на валидность;
- `checkPaymentValidation(): string | undefined` — метод, проверящий поле инпута адреса доставки на ошибки и возвращает либо ошибку либо `undefined`;
- `checkEmailValidation(): string | undefined` — метод, проверящий поле инпута электронной почты на ошибки и возвращает либо ошибку либо `undefined`;
- `checkPhoneValidation(): string | undefined` — метод, проверящий поле инпута номера телефона на ошибки и возвращает либо ошибку либо `undefined`;
- `clearForm(): void` — очищает все сохраненные данные в полях.

Также в классе есть сеттеры и геттеры для полей класса `payment`, `address`, `email` и `phone`.

### Компоненты представления

Все классы представления нужны для отображения передаваемых данных внутри DOM-элементах.

#### Базовый класс Component

Класс дженерик является базовым классом для всех классов представления. В дженерик принимается тип объекта, который будет передаваться в метод `render` для отображения данных в компоненте.

В конструкторе принимается элемент разметки в качестве родительского контейнера компонента.

Класс `Component` содержит также метод `decoratePrice` который принимает в себя `number` и на выходе отдает `string`.\
Этот метод позволяет перевести цену предмета из численного значения в текстовый формат необходимый для разметки. Например, на вход получаем `1000`, а на выходе метод отдает `1 000 синапсов`.

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна.\
Конструктор принимает контейнер и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `_closeButton: HTMLButtonElement` — кнопка для закрытия;
- `_content: HTMLElement` — контент, который необходимо отобразить.

Также в классе реализован сеттер для `content`.

#### Класс Page

Класс отвечает за управление основными элементами главной страницы.
Конструктор принимает контейнер и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `_counter: HTMLElement` — счетчик корзины;
- `_gallery: HTMLElement` — каталог товаров;
- `_basket: HTMLElement` — корзина;
- `_wrapper: HTMLElement` — блокировка прокрутки главной страницы.

Также в классе реализован сеттеры для `counter`, `gallery`, `locked` то есть `_wrapper`.

#### Класс Item

Класс отвечает за отображение предмета на главной странице, на превью и в корзине.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий и `check?` который отвечает за то, что находится ли товар в корзине или нет при отображении в превью для изменения состояния кнопки на удаление из корзины.

Поля класса:
- `itemTitle: HTMLElement` — счетчик корзины;
- `itemPrice: HTMLElement` — элемент для отображения цены товара;
- `itemId: string` — айди товара;
- `_description: string` — описание товара;
- `_price: number` — цена товара до преобразования в `string`;
- `itemImage?: HTMLImageElement` — элемент для отображения картинки в превью и на главной странице;
- `itemCategory?: HTMLElement` — элемент для отображения категории в превью и на главной странице;
- `itemDescription?: HTMLElement` — элемент для отображения описания в превью;
- `itemIndex?: HTMLElement` — элемент для отображения индекса элемента в корзине;
- `button?: HTMLButtonElement` — кнопка для удаления или добавления в корзину.

В классе реализованы сеттеры и геттеры соответствующих полей классов.

#### Класс Basket

Класс отвечает за отображение корзины в модальном окне.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `_list: HTMLElement` — элемент списка товаров;
- `_summary: HTMLElement` — элемент общей суммы корзины;
- `_buyButton: HTMLButtonElement` — кнопка для совершения покупки;
- `_sum: string` — сумма корзины.

В классе есть метод `lock(length: number): void`. Он блокируют кнопку дальнейшей покупки товара, если корзина будет пуста.

В классе реализованы сеттеры и геттеры соответствующих полей классов.

#### Класс Form

Родительский класс для `Payment` и `Contacts`. Отвечает за отображение ошибок и блокировки кнопки сабмита.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `submitButton: HTMLButtonElement` — кнопка сабмита;
- `errorForm: HTMLElement` — элемент отображения ошибок.

В классе реализованы соответствующие сеттеры.

#### Класс Payment

Класс отвечает за отображение формы выбора оплаты корзины и адреса доставки в модальном окне.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `cardRadio: HTMLButtonElement` — элемент кнопки оплаты по карте;
- `cashRadio: HTMLButtonElement` — элемент кнопки оплаты за наличные;
- `addressInput: HTMLInputElement` — элемент ввода адреса доставки.

В классе есть методы:
- `toggleButtons(payment: string): void` — смена выбора способа оплаты;
- `clearForm(): void` — очищает форму.

В классе реализованы сеттеры соответствующих полей классов.

#### Класс Contacts

Класс отвечает за отображение формы контактных данных пользователя в модальном окне.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `emailInput: HTMLInputElement` — элемент ввода электронной почты;
- `phoneInput: HTMLInputElement` — элемент ввода номера телефона.

В классе есть методы:
- `lock(): void` — метод проверяет заполненны ли оба поля или нет, если нет, то он блокирует кнопку сабмита;
- `clearForm(): void` — очищает форму.

В классе реализованы сеттеры соответствующих полей классов.

#### Класс Success

Класс отвечает за отображение формы контактных данных пользователя в модальном окне.

В конструкторе класс принимает контейнер, экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- `itemSum: HTMLElement` — элемент отображения суммы покупки;
- `successButton: HTMLButtonElement` — элемент ввода номера телефона.

В классе реализованы сеттер `total`, который заполняет поля класса `itemSum: HTMLElement` суммой покупки.

### Слой коммутации

#### Класс AppApi

Принимает в конструктор экземпляр класса `Api` и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов

Код, описанный в файле `index.ts`, будет выполнять роль презентера, который описывает взаимодействие между представлением и данными.\
Взаимодействия выполняются благодаря генерации событий и их обработчиков.\

В файле `index.ts` сначала создаются все необходимые шаблоны и экземпляры классов, а после уже настраиваются обработка событий.

## Все события

```
enum Events {
  INITIAL_LOADED = 'initialData:loaded', //Событие выгрузки всех начальных данных с сервера
  BUY = 'item:buy', //Событие добавления предмета в корзину
  SELECT = 'item:select', //Событие выбора предмета для отображения в модальном окне превью
  DELETE = 'item:delete', //Событие удаления предмета из корзины
  ITEM_OPEN = 'item:open', //Событие открытия модального окна превью
  BASKET_OPEN = 'basket:open', //Событие открытия модального окна корзины
  BASKET_CHANGE = 'basket:change', //Событие изменения данных в корзине
  PAY = 'basket:pay', //Событие открытия модального окна формы с выбором оплаты и инпутом адреса доставки
  PAYMENT = 'payment:change', //Событие изменения выбора способа оплаты
  ADDRESS = 'address:change', //Событие изменения текста в строке инпута
  NEXT = 'payment:next', //Событие открытия модального окна формы контактов пользователя
  CONTACTS = 'contacts:change', //Событие изменения вводимых значений в инпутах
  CONFIRM = 'contacs:confirm', //Событие открытия модального окна успешной покупки
  SUCCESS = 'success:complete', //Событие закрытия модального окна успешной покупки
  ERROR = 'form:error', //Событие для обработки ошибок в заполенных формах
  VALID = 'form:valid', //Событие для обработки валидации в заполненных формах
  OPEN = 'modal:open', //Событие для открытия модального окна
  CLOSE = 'modal:close' //Событие закрытия модального окна
}
```