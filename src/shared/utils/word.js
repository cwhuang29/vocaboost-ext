import { WORD_LIST } from '@constants/words';

export const genWordList = () => [...WORD_LIST.GRE, ...WORD_LIST.TOEFL].map(item => item.word);

export const genWordDetailList = () => [...WORD_LIST.GRE, ...WORD_LIST.TOEFL];

export const getRandomWordFromList = () => {
  const wordList = genWordDetailList();

  let w = wordList[Math.floor(Math.random() * wordList.length)];
  while (!w?.detail[0]?.meaning?.en) {
    w = wordList[Math.floor(Math.random() * wordList.length)];
  }
  return w;
};
