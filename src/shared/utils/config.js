import { HIGHLIGHTER_FONT_SIZE } from '@shared/constants';
import { LANGS } from '@shared/constants/i18n';
import { HIGHLIGHTER_BG_COLORS } from '@shared/constants/styles';

export const isConfigEqual = (c1, c2) => {
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
