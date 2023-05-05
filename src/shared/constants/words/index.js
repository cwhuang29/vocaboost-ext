import { LANGS_SUPPORTED } from '@constants/i18n';

import GRE_en from './gre/en';
import GRE_es from './gre/es';
import GRE_ja from './gre/ja';
import GRE_ko from './gre/ko';
import GRE_th from './gre/th';
import GRE_zh_CN from './gre/zh_cn';
import GRE_zh_TW from './gre/zh_tw';

export const GRE = {
  [LANGS_SUPPORTED.en]: GRE_en,
  [LANGS_SUPPORTED.es]: GRE_es,
  [LANGS_SUPPORTED.ja]: GRE_ja,
  [LANGS_SUPPORTED.ko]: GRE_ko,
  [LANGS_SUPPORTED.th]: GRE_th,
  [LANGS_SUPPORTED.zh_CN]: GRE_zh_CN,
  [LANGS_SUPPORTED.zh_TW]: GRE_zh_TW,
};
