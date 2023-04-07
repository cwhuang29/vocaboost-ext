import { getStorage, setStorage } from '@browsers/storage';
import { HIGHLIGHTER_BG_COLORS, HIGHLIGHTER_FONT_SIZE, LANGS } from '@constants/index';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import userService from '@services/user.service';
import { logger } from '@utils/logger';

export const DEFAULT_CONFIG = {
  highlightColor: HIGHLIGHTER_BG_COLORS.YELLOW,
  language: LANGS.en,
  fontSize: HIGHLIGHTER_FONT_SIZE.MEDIUM,
  showDetail: true,
  collectedWords: [],
  suspendedPages: [],
  updatedAt: new Date(),
};

export const isConfigEqual = (config1 = {}, config2 = {}) => {
  const c1 = isObject(config1) ? config1 : JSON.parse(config1);
  const c2 = isObject(config2) ? config2 : JSON.parse(config2);

  if (Object.keys(c1).length !== Object.keys(c2).length) {
    return false;
  }

  return Object.entries(c1).filter(([key, val]) => (isArray(val) ? val.length !== c2[key].length : val !== c2[key])).length === 0;
};

export const syncUpConfigToServer = async config => {
  let latestConfig = config;

  try {
    const { isStale, data, error } = await userService.updateUserSetting(config);
    if (error) {
      logger(`Update config to server error: ${error}`);
    }
    if (isStale) {
      latestConfig = data;
    }
  } catch (err) {
    logger(`Update config to server unknown error: ${err}`);
  }
  return latestConfig;
};

export const getConfig = async () => {
  const c = await getStorage({ type: 'local', key: EXT_STORAGE_CONFIG });
  return c ? c[EXT_STORAGE_CONFIG] : null;
};

export const storeConfig = config => {
  setStorage({ type: 'local', key: EXT_STORAGE_CONFIG, value: config });
};

export const setupDefaultConfigIfNotExist = async () => {
  let config = await getStorage({ type: 'local', key: EXT_STORAGE_CONFIG });

  if (!config || Object.keys(config).length === 0) {
    config = DEFAULT_CONFIG;
    storeConfig(config);
  }
  logger(`Get config after installation. Config: ${JSON.stringify(config)}`);
};

export const setURLToConfigFormat = url => {
  const u = typeof url === 'string' ? new URL(url) : url;
  return `${u.protocol}//${u.host}`;
};
