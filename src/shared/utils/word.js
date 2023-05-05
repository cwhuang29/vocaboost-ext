import { LANGS_SUPPORTED } from '@constants/i18n';
import { GRE } from '@constants/words';

export const genWordDetailList = (locale = LANGS_SUPPORTED.en) => GRE[locale];

export const getRandomWordFromList = (locale = LANGS_SUPPORTED.en) => {
  const wordList = genWordDetailList(locale);

  let w = wordList[Math.floor(Math.random() * wordList.length)];
  while (!w?.detail[0]?.meaning?.en) {
    w = wordList[Math.floor(Math.random() * wordList.length)];
  }
  return w;
};
