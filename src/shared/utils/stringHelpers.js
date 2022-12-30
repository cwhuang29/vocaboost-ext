export const toCapitalize = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const snakeCaseToTitleCase = s =>
  s
    .split('_')
    .filter(ss => ss.length)
    .map(sss => toCapitalize(sss))
    .join('');

export const snakeCaseToCamelCase = s => {
  const tmp = snakeCaseToTitleCase(s);
  return `${tmp.charAt(0).toLowerCase()}${tmp.slice(1)}`;
};

export const toTransactionNumber = s => {
  const str = s.toString();
  const hasSign = Number.isNaN(str.charAt(0));
  const sign = hasSign ? str.charAt(0) : '';
  const startIdx = hasSign ? 1 : 0;
  const ss = str.slice(startIdx).split('.');

  ss[0] = ss[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + ss.join('.');
};

export const onlyAlpha = s => /^[A-Za-z]*$/.test(s);

export const onlyAlphaAndDigit = s => /^[A-Za-z0-9]*$/.test(s);
