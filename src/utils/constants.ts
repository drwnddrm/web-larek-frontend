export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  headers: {
    'Content-Type': 'application/json',
  }
};

export const ERRORS = {
  email: 'Введен неверный формат адреса электронной почты',
  phone: 'Введен неверный формат номера телефона',
  address: 'Введен неверный формат адреса доставки. Пример: 111111, Москва, ул. Пушкина, д. 1'
}

export const REGEX = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/,
  address: /\d{6}\,\W[а-яА-Я]{2,}\,\W[ул]{2}\.\W[а-яА-Я]{2,}\,\W[д]{1}\.\W\d{1,5}/
}

