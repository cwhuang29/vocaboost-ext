import {
  HIGHLIGHTER_BG_COLOR_CLASS,
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_HIDDEN_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_FONT_SIZE_CLASS,
  HIGHLIGHTER_LINK_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_POS_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  ONLINE_DIC_URL,
  PARTS_OF_SPEECH_SHORTHAND,
} from '@shared/constants';
import { LANGS } from '@shared/constants/i18n';

import { toCapitalize } from './stringHelpers';

const constructLink = ({ language, word, fontSizeClass }) =>
  `<a class="${HIGHLIGHTER_LINK_CLASS} ${fontSizeClass}" href="${ONLINE_DIC_URL[language]}${word}" target="_blank" rel="noopener noreferrer">Check out on dictionary</a>`;

export const constructWordExample = (example = '') => {
  const punc = example.length > 0 && ['.', '?', '!'].indexOf(example.slice(-1)) === -1 ? '.' : '';
  return `${toCapitalize(example)}${punc}`;
};

export const genHighlightSyntax = ({ config, orgWord, word }) => {
  const { highlightColor, language, fontSize, showDetail } = config;
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[highlightColor];
  const fontSizeClass = HIGHLIGHTER_FONT_SIZE_CLASS[fontSize];
  const detailItemHiddenClass = showDetail ? '' : HIGHLIGHTER_DETAIL_HIDDEN_CLASS;

  let items = [];
  word.detail.forEach(({ meaning, partsOfSpeech, example }) => {
    if (!partsOfSpeech) {
      return;
    }
    const pos = PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech];
    const def = meaning[LANGS.en]; // Note: for now only english explanation is supported
    const sentence = constructWordExample(example);
    const posTemplate = pos ? `<span class="${HIGHLIGHTER_POS_CLASS}">${pos}&nbsp;&nbsp;</span>` : '';
    const detail = `<div class="${HIGHLIGHTER_DETAIL_ITEM_CLASS} ${fontSizeClass}">${posTemplate}${def}<br>${sentence}</div>`;
    items = [...items, detail];
  });

  const link = constructLink({ language, word: word.word, fontSizeClass });
  items = [...items, link];

  const highlightWord = `<span class="${HIGHLIGHTER_ORG_WORD_CLASS} ${highlightColorClass}">${orgWord}</span>`;
  const targetWord = `<div class="${HIGHLIGHTER_TARGET_WORD_CLASS} ${fontSizeClass}">${word.word}</div>`;
  const highlightDetailItem = items.join('');
  const highlightDetail = `<div class="${HIGHLIGHTER_DETAIL_CLASS} ${detailItemHiddenClass}">${targetWord}${highlightDetailItem}</div>`;
  return `<span class="${HIGHLIGHTER_CLASS}" tabindex="0">${highlightWord}${highlightDetail}</span>`;
};

/*
 * Note:
 * Use a parent element .HIGHLIGHTER_CLASS to contain both the highlighted word and the popup
 * Without the parent element, even if we can show the detail popup by hover/focus events, we can neither select text nor click the link
 * Correct: .HIGHLIGHTER_CLASS:hover > .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 * Incorrect: .HIGHLIGHTER_ORG_WORD_CLASS:hover + .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 */
