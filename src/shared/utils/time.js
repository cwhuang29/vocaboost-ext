import { isDate } from './misc';

export const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

// Backend stores time in the UTC time zone. When the API responses with data such as { "createdAt":"2022-04-25T15:33:13.056Z" } (type is time.Time)
// The JS new Date(value) changes time zone from UTC to user's location
export const getDisplayTime = (date = new Date()) =>
  `${date.getFullYear()}/${`0${date.getMonth() + 1}`.slice(-2)}/${date.getDate()} ${`0${date.getHours()}`.slice(-2)}:${`0${date.getMinutes()}`.slice(-2)}`;

export const getTodayWithoutTime = () => {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};

export const isSameDay = (d1, d2) => d1.getDate() === d2.getDate();

export const getLocalDate = () => new Date();

export const getUTCDate = () => {
  const d = new Date();
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
};

export const convertUTCToLocalTime = date => {
  const d = isDate(date) ? date : new Date(date);
  const offset = new Date().getTimezoneOffset();
  d.setMinutes(d.getMinutes() - offset);
  return d;
};

export const hasWaitedLongEnough = ({ now, then, intervalSecs }) => (now.getTime() - then.getTime()) / 1000 > intervalSecs;
