import { setStorage } from '@browsers/storage';
import { LANGS_SUPPORTED } from '@constants/i18n';
import { DEFAULT_CONFIG, getConfig, storeConfig } from '@utils/config';
import { logger } from '@utils/logger';
import { getWordListStorageKey } from '@utils/storage';
import { getLocalDate } from '@utils/time';
import { genWordDetailList } from '@utils/word';

export const storeEssentialDataOnInstall = async () => {
  const storeWordLists = Object.values(LANGS_SUPPORTED).map(locale => {
    const key = getWordListStorageKey(locale);
    const wordList = genWordDetailList(locale);
    return setStorage({ type: 'local', key, value: wordList });
  });
  await Promise.all([storeConfig(DEFAULT_CONFIG), ...storeWordLists]);

  logger('[background] Init storage settings done!');
};

// Note: this function should be updated everytime
export const updateIfNeeded = async () => {
  const config = (await getConfig()) || DEFAULT_CONFIG;

  if (!config.suspendedPages) {
    await storeConfig({ ...config, suspendedPages: [], updatedAt: getLocalDate() });
    logger('[background] config is updated (added the suspendedPages attr)!');
  }
};
