export const isTruthy = x => !!x;

export const isObject = x => Object.prototype.toString.call(x) === '[object Object]';

export const isArray = x => Array.isArray(x);

export const isDate = x => x instanceof Date;

export const isObjectEmpty = x => !x || Object.keys(x).length === 0;
