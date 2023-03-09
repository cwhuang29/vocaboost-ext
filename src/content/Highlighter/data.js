import { sendMessage } from '@browsers/message';
import { getStorage, setStorage } from '@browsers/storage';
import { EXT_MSG_TYPE_GET_WORD_LIST } from '@constants/messages';
import { EXT_STORAGE_WORD_LIST } from '@constants/storage';

export const getAllWords = async () => {
  const cache = await getStorage({ type: 'local', key: EXT_STORAGE_WORD_LIST });

  let wordListStr = null;
  if (cache[EXT_STORAGE_WORD_LIST]) {
    wordListStr = cache[EXT_STORAGE_WORD_LIST];
  } else {
    wordListStr = await sendMessage({ type: EXT_MSG_TYPE_GET_WORD_LIST });
    setStorage({ type: 'local', key: EXT_STORAGE_WORD_LIST, value: wordListStr });
  }

  if (!wordListStr) {
    return new Map([]);
  }

  const wordList = JSON.parse(wordListStr).filter(item => item);
  return new Map(wordList.map(item => [item.word, item]));
};
