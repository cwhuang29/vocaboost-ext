import { getStorage, setStorage } from '@browsers/storage';
import { LANGS_SUPPORTED } from '@constants/i18n';
import { HIGHLIGHTER_BG_COLORS, HIGHLIGHTER_FONT_SIZE, HIGHLIGHTER_FONT_STYLE } from '@constants/index';
import { EXT_SYNC_UP_CONFIG_INTERVAL } from '@constants/network';
import { EXT_STORAGE_CONFIG, EXT_STORAGE_LAST_SYNC_UP_TIME } from '@constants/storage';
import userService from '@services/user.service';
import { logger } from '@utils/logger';

import { getAuthTokenFromStorage } from './auth';
import { isArray, isObject, isObjectEmpty } from './misc';
import { convertUTCToLocalTime, getLocalDate, hasWaitedLongEnough } from './time';

export const DEFAULT_CONFIG = {
  highlightColor: HIGHLIGHTER_BG_COLORS.YELLOW,
  language: LANGS_SUPPORTED.en,
  fontSize: HIGHLIGHTER_FONT_SIZE.MEDIUM,
  fontStyle: HIGHLIGHTER_FONT_STYLE.ROBOTO,
  showDetail: true,
  collectedWords: [],
  suspendedPages: [],
  updatedAt: new Date('Wed Apr 05 2000 00:00:00'),
};

export const storeConfig = config => {
  const serialize = { ...config, updatedAt: config.updatedAt.toString() };
  setStorage({ type: 'local', key: EXT_STORAGE_CONFIG, value: serialize });
};

export const getConfig = async () => {
  const cache = await getStorage({ type: 'local', key: EXT_STORAGE_CONFIG });
  const config = cache[EXT_STORAGE_CONFIG] ?? null;
  if (config) {
    Object.assign(config, { updatedAt: new Date(config.updatedAt) });
  }
  return config;
};

export const storeLastSyncUpTime = () => setStorage({ type: 'sync', key: EXT_STORAGE_LAST_SYNC_UP_TIME, value: getLocalDate().toString() });

export const getLastSyncUpTime = async () => {
  const cache = await getStorage({ type: 'sync', key: EXT_STORAGE_LAST_SYNC_UP_TIME });
  const lastSyncUpTime = cache[EXT_STORAGE_LAST_SYNC_UP_TIME] ?? null;
  return lastSyncUpTime ? new Date(lastSyncUpTime) : null;
};

const canSyncUpAgain = async () => {
  const [token, lastSyncUpTime] = await Promise.all([getAuthTokenFromStorage(), getLastSyncUpTime()]);
  if (!token) {
    return false;
  }
  if (!lastSyncUpTime) {
    return true;
  }
  return hasWaitedLongEnough({ now: getLocalDate(), then: lastSyncUpTime, intervalSecs: EXT_SYNC_UP_CONFIG_INTERVAL });
};

const syncUpConfigToServer = async config => {
  let latestConfig = config;
  let isConfigStale = false;

  try {
    const { isStale, data, error } = await userService.updateUserSetting(config).catch(err => logger(`Update config to server unknown error: ${err}`));
    isConfigStale = isStale;

    if (error) {
      logger(`Update config to server error: ${error}`);
    }
    if (isConfigStale) {
      latestConfig = { ...data, updatedAt: convertUTCToLocalTime(data.updatedAt) };
      logger(`Ext config is outdated. Store latest config from backend: ${latestConfig}`);
      await storeConfig(latestConfig);
    }
    await storeLastSyncUpTime();
  } catch (err) {
    // do nothing
  }
  return { latestConfig, isStale: isConfigStale };
};

export const trySyncUpConfigToServer = async config => {
  const canSyncUp = await canSyncUpAgain();
  if (!canSyncUp) {
    logger('Cannot sync up due to lack of token or querying too frequently');
    return { latestConfig: config, isStale: false };
  }
  return syncUpConfigToServer(config);
};

export const fetchLatestConfigOnLogin = async () => syncUpConfigToServer(DEFAULT_CONFIG);

export const isConfigEqual = (config1 = {}, config2 = {}) => {
  const c1 = isObject(config1) ? config1 : JSON.parse(config1);
  const c2 = isObject(config2) ? config2 : JSON.parse(config2);

  if (Object.keys(c1).length !== Object.keys(c2).length) {
    return false;
  }

  const misMatches = Object.entries(c1).filter(([key, val]) => {
    if (isArray(val)) {
      return val.length !== c2[key].length; // Not accurate but acceptable
    }
    return val !== c2[key];
  });
  return misMatches.length === 0;
};

export const shouldUpdateConfig = ({ currConfig, prevConfig }) => {
  if (isObjectEmpty(prevConfig)) {
    return true;
  }
  if (isObjectEmpty(currConfig)) {
    return false;
  }
  if (!currConfig.updatedAt) {
    return false;
  }
  if (prevConfig.updatedAt && currConfig.updatedAt < prevConfig.updatedAt) {
    return false;
  }
  if (isConfigEqual(currConfig, prevConfig)) {
    return false;
  }
  return true;
};

export const setURLToConfigFormat = url => {
  const u = typeof url === 'string' ? new URL(url) : url;
  return `${u.protocol}//${u.host}`;
};
