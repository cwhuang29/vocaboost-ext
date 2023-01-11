export const insertIcons = () => {
  const links = ['https://fonts.googleapis.com/icon?family=Material+Icons'];
  const id = 'vocabulary-highlighter-icon-';

  links.forEach((link, idx) => {
    const fontStyle = document.createElement('link');

    fontStyle.id = `${id}-${idx}`;
    fontStyle.rel = 'stylesheet';
    fontStyle.href = link;
    document.head.appendChild(fontStyle);
  });
};

export const insertFontStyles = () => {
  const links = ['https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'];
  const id = 'vocabulary-highlighter-font-style-';

  links.forEach((link, idx) => {
    const fontStyle = document.createElement('link');

    fontStyle.id = `${id}-${idx}`;
    fontStyle.rel = 'stylesheet';
    fontStyle.href = link;
    document.head.appendChild(fontStyle);
  });
};
