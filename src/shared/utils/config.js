import { getStorage, setStorage } from '@browsers/storage';
import { HIGHLIGHTER_BG_COLORS, HIGHLIGHTER_FONT_SIZE, LANGS } from '@constants/index';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import { logger } from '@utils/logger';
import { isObject } from '@utils/misc';

export const DEFAULT_CONFIG = {
  highlightColor: HIGHLIGHTER_BG_COLORS.YELLOW,
  language: LANGS.en,
  fontSize: HIGHLIGHTER_FONT_SIZE.MEDIUM,
  showDetail: true,
};

export const isConfigEqual = (config1 = {}, config2 = {}) => {
  const c1 = isObject(config1) ? config1 : JSON.parse(config1);
  const c2 = isObject(config2) ? config2 : JSON.parse(config2);

  const cond1 = Object.keys(c1).filter(key => c1[key] !== c2[key]).length === 0;
  const cond2 = Object.keys(c2).filter(key => c1[key] !== c2[key]).length === 0;
  return cond1 && cond2;
};

export const setupDefaultConfigIfNotExist = async () => {
  let config = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });

  if (!config || Object.keys(config).length === 0) {
    config = DEFAULT_CONFIG;
    await setStorage({ type: 'sync', key: EXT_STORAGE_CONFIG, value: config });
  }
  logger(`Get config after installation. Config: ${JSON.stringify(config)}`);
};
