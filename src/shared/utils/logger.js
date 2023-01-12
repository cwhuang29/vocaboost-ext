export const logger = (...messages) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...messages);
  }
};
