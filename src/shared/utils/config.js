import { HIGHLIGHTER_BG_COLORS, HIGHLIGHTER_FONT_SIZE, LANGS } from '@constants/index';
import { isObject } from '@utils/misc';

export const isConfigEqual = (config1 = {}, config2 = {}) => {
  const c1 = isObject(config1) ? config1 : JSON.parse(config1);
  const c2 = isObject(config2) ? config2 : JSON.parse(config2);

  const cond1 = Object.keys(c1).filter(key => c1[key] !== c2[key]).length === 0;
  const cond2 = Object.keys(c2).filter(key => c1[key] !== c2[key]).length === 0;
  return cond1 && cond2;
};

export const getDefaultConfig = () => ({
  highlightColor: HIGHLIGHTER_BG_COLORS.YELLOW,
  language: LANGS.en,
  fontSize: HIGHLIGHTER_FONT_SIZE.MEDIUM,
  showDetail: true,
});
