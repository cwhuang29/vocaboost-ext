import { setStorage } from '@browsers/storage';
import { EXT_STORAGE_WORD_LIST } from '@constants/storage';
import { DEFAULT_CONFIG, getConfig, storeConfig } from '@utils/config';
import { logger } from '@utils/logger';
import { getLocalDate } from '@utils/time';
import { genWordDetailList } from '@utils/word';

export const storeEssentialDataOnInstall = async () => {
  const words = genWordDetailList();

  await Promise.all([storeConfig(DEFAULT_CONFIG), setStorage({ type: 'local', key: EXT_STORAGE_WORD_LIST, value: JSON.stringify(words) })]);

  logger('[background] Init storage settings done!');
};

// Note: this function should be updated everytime
export const updateIfNeeded = async () => {
  const config = await getConfig();

  if (!config.suspendedPages) {
    await storeConfig({ ...config, suspendedPages: [], updatedAt: getLocalDate() });
    logger('[background] config is updated (added the suspendedPages attr)!');
  }
};
