/*
 * Before:
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * <div> 4 days ago — docile implies a predisposition to ...</div>
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * After:
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 * <div> 4 days ago —
 *   <span class="HIGHLIGHTER_CLASS" tabindex="0">
 *     <span class="HIGHLIGHTER_ORG_WORD_CLASS HIGHLIGHTER_BG_COLOR_CLASS_GREEN">
 *       docile
 *     </span>
 *     <div class="HIGHLIGHTER_DETAIL_CLASS">
 *       <div style="display: flex;">
 *         <div class="HIGHLIGHTER_TARGET_WORD_CLASS HIGHLIGHTER_FONT_SIZE_CLASS_MEDIUM">docile</div>
 *         <div style="width: 15px"></div>
 *         <a class="HIGHLIGHTER_ICON_CLASS" href="https://dictionary.cambridge.org/dictionary/english/docile" data-word="docile" target="_blank" rel="noopener noreferrer">
 *          <span class="material-icons" style="color: rgb(239 239 239)">menu_book</span>
 *        </a>
 *       </div>
 *       <div class="HIGHLIGHTER_DETAIL_ITEM_CLASS HIGHLIGHTER_FONT_SIZE_CLASS_MEDIUM">
 *         <span class="HIGHLIGHTER_POS_CLASS">(adj.)&nbsp;&nbsp;</span>ready to accept control or instruction; submissive<br>A cheap and docile workforce.
 *       </div>
 *     </div>
 *   </span>
 * implies a predisposition to ...</div>
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Note:
 * Use a parent element .HIGHLIGHTER_CLASS to contain both the highlighted word and the popup
 * Without the parent element, even if we can show the detail popup by hover/focus events, we can neither select text nor click the link
 * Correct: .HIGHLIGHTER_CLASS:hover > .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 * Incorrect: .HIGHLIGHTER_ORG_WORD_CLASS:hover + .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 */
import {
  HIGHLIGHTER_BG_COLOR_CLASS,
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_HIDDEN_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_FONT_SIZE_CLASS,
  HIGHLIGHTER_ICON_CLASS,
  // HIGHLIGHTER_LINK_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_POS_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  LANGS,
  ONLINE_DIC_URL,
  PARTS_OF_SPEECH_SHORTHAND,
} from '@shared/constants';

import { toCapitalize } from './stringHelpers';

// https://fonts.google.com/icons?selected=Material+Icons&icon.query=menu+book
const getIcon = ({ word, url }) =>
  `<a class="${HIGHLIGHTER_ICON_CLASS}" href="${url}" data-word=${word} target="_blank" rel="noopener noreferrer">
     <span class="material-icons" style="color: rgb(239 239 239)">menu_book</span>
   </a>`;

// const constructLink = ({ language, word, fontSizeClass }) =>
//   `<a class="${HIGHLIGHTER_LINK_CLASS} ${fontSizeClass}" href="${ONLINE_DIC_URL[language]}${word}" target="_blank" rel="noopener noreferrer">Check out on dictionary</a>`;

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

  const link = getIcon({ word: word.word, url: `${ONLINE_DIC_URL[language]}${word.word}` });
  const highlightWord = `<span class="${HIGHLIGHTER_ORG_WORD_CLASS} ${highlightColorClass}">${orgWord}</span>`;
  const targetWord = `<div style="display: flex;"><div class="${HIGHLIGHTER_TARGET_WORD_CLASS} ${fontSizeClass}">${word.word}</div><div style="width: 15px"></div>${link}</div>`;
  const highlightDetailItem = items.join('');
  const highlightDetail = `<div class="${HIGHLIGHTER_DETAIL_CLASS} ${detailItemHiddenClass}">${targetWord}${highlightDetailItem}</div>`;
  return `<span class="${HIGHLIGHTER_CLASS}" tabindex="0">${highlightWord}${highlightDetail}</span>`;
};
