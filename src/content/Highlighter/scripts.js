export const insertIcons = () => {
  const fontStyle = document.createElement('link');

  fontStyle.id = 'vocabulary-highlighter-icon';
  fontStyle.rel = 'stylesheet';
  fontStyle.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(fontStyle);
};

export const insertFontStyles = () => {
  const fontStyle = document.createElement('link');

  fontStyle.id = 'vocabulary-highlighter-font-style';
  fontStyle.rel = 'stylesheet';
  fontStyle.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap';
  document.head.appendChild(fontStyle);
};
