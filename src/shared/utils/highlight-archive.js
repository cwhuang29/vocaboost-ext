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
 *         <span class="HIGHLIGHTER_POS_CLASS">(adj.)</span>
 *         <span class="HIGHLIGHTER_DEF_CLASS" data-en="..." data-zh_tw="...">ready to accept control or instruction; submissive</span>
 *         <br>
 *         A cheap and docile workforce.
 *       </div>
 *     </div>
 *   </span>
 * implies a predisposition to ...</div>
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Note:
 * Text nodes themselves contain values only. Modify their parent nodes to change styling
 *
 * Parts of speech's parent node is span.HIGHLIGHTER_POS_CLASS. Meaning's parent node is span.HIGHLIGHTER_DEF_CLASS
 * Since example does not have it's own tag, it's parent node is div.HIGHLIGHTER_DETAIL_ITEM_CLASS.HIGHLIGHTER_FONT_SIZE_CLASS_MEDIUM
 * However, if this vocabulary does not have example, then we won't be able to change their font size. Hence, use pos's parent's parent
 *
 * span.material-icons will be further transfered by library
 *
 * data-* attributes are all lower casess
 *
 * Use a parent element .HIGHLIGHTER_CLASS to contain both the highlighted word and the popup
 * Without the parent element, even if we can show the detail popup by hover/focus events, we can neither select text nor click the link
 * Correct: .HIGHLIGHTER_CLASS:hover > .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 * Incorrect: .HIGHLIGHTER_ORG_WORD_CLASS:hover + .HIGHLIGHTER_DETAIL_CLASS { visibility: visible !important; }
 */

/*
import {
  HIGHLIGHTER_BG_COLOR_CLASS,
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DEF_CLASS,
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
} from '@constants/index';

import { toCapitalize } from './stringHelpers';

// https://fonts.google.com/icons?selected=Material+Icons&icon.query=menu+book
const getIcon = ({ word, url }) =>
  `<a class="${HIGHLIGHTER_ICON_CLASS}" href="${url}" data-word=${word} target="_blank" rel="noopener noreferrer">
     <span class="material-icons" style="color: rgb(239 239 239)">menu_book</span>
   </a>`;

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
    const posTemplate = pos ? `<span class="${HIGHLIGHTER_POS_CLASS}">${pos}</span>` : '';
    const def = meaning[LANGS[language]] || meaning[LANGS.en];
    const defTemplate = `<span class="${HIGHLIGHTER_DEF_CLASS}"
      data-en="${meaning[LANGS.en] || ''}"
      data-es="${meaning[LANGS.es] || ''}"
      data-zh_TW="${meaning[LANGS.zh_TW] || ''}"
      data-zh_CN="${meaning[LANGS.zh_TW] || ''}"
      >${def}</span>`; // Note: the attributes of data-* will be transfered to lower case, and use zh_TW value for zh_CN
    const sentence = constructWordExample(example);
    const detail = `<div class="${HIGHLIGHTER_DETAIL_ITEM_CLASS} ${fontSizeClass}">${posTemplate}${defTemplate}<br>${sentence}</div>`;
    items = [...items, detail];
  });

  const link = getIcon({ word: word.word, url: `${ONLINE_DIC_URL[language]}${word.word}` });
  const highlightWord = `<span class="${HIGHLIGHTER_ORG_WORD_CLASS} ${highlightColorClass}">${orgWord}</span>`;
  const targetWord = `<div style="display: flex;">
      <div class="${HIGHLIGHTER_TARGET_WORD_CLASS} ${fontSizeClass}">${word.word}</div><div style="width: 15px"></div>${link}
    </div>`;
  const highlightDetailItem = items.join('');
  const highlightDetail = `<div class="${HIGHLIGHTER_DETAIL_CLASS} ${detailItemHiddenClass}">${targetWord}${highlightDetailItem}</div>`;
  return `<span class="${HIGHLIGHTER_CLASS}" tabindex="0">${highlightWord}${highlightDetail}</span>`;
};
*/
