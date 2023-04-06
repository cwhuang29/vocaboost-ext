import { getStorage, setStorage } from '@browsers/storage';
import { EXT_STORAGE_CONFIG, EXT_STORAGE_WORD_LIST } from '@constants/storage';
import { DEFAULT_CONFIG } from '@utils/config';
import { logger } from '@utils/logger';
import { genWordDetailList } from '@utils/word';

export const storeEssentialDataOnInstall = async () => {
  const config = DEFAULT_CONFIG;
  const words = genWordDetailList();

  await Promise.all([
    setStorage({ type: 'local', key: EXT_STORAGE_CONFIG, value: config }),
    setStorage({ type: 'local', key: EXT_STORAGE_WORD_LIST, value: JSON.stringify(words) }),
  ]);

  logger('[background] Init storage settings done!');
};

// Note: this function should be updated everytime
export const updateIfNeeded = async () => {
  const cfg = await getStorage({ type: 'local', key: EXT_STORAGE_CONFIG });

  if (!cfg[EXT_STORAGE_CONFIG].suspendedPages) {
    const newCfg = { ...cfg[EXT_STORAGE_CONFIG], suspendedPages: [] };
    await setStorage({ type: 'local', key: EXT_STORAGE_CONFIG, value: newCfg });
    logger('[background] config is updated (added the suspendedPages attr)!');
  }
};
