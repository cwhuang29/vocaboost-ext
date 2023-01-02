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
