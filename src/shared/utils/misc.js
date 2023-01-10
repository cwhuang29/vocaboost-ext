export const isTruthy = x => !!x;

export const isObject = x => Object.prototype.toString.call(x) === '[object Object]';
