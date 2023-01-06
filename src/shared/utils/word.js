import { WORD_LIST } from '@constants/words';

export const genWordList = () => {
  const targetList = [...WORD_LIST.GRE, ...WORD_LIST.TOEFL];
  const wordsArr = targetList.map(item => item.word);

  // const words = new Set();
  // targetList.forEach(item => words.add(item.word));
  return wordsArr;
};

export const genWordDetailList = () => {
  const targetList = [...WORD_LIST.GRE, ...WORD_LIST.TOEFL];

  // return new Map(targetList.map(item => [item.word, item.detail]));
  return targetList;
};

export const getRandomWordFromList = () => {
  const wordList = genWordDetailList();

  let w = wordList[Math.floor(Math.random() * wordList.length)];
  while (!w?.detail[0]?.meaning?.en) {
    w = wordList[Math.floor(Math.random() * wordList.length)];
  }
  return w;
};
