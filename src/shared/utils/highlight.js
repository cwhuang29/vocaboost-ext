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
 *   </span>
 * implies a predisposition to ...</div>
 * -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 *
 * Note: text nodes themselves contain values only. Modify their parent nodes to change styling
 */
import { getStorage } from '@browsers/storage';
import { HIGHLIGHTER_BG_COLOR_CLASS, HIGHLIGHTER_CLASS, HIGHLIGHTER_ORG_WORD_CLASS } from '@constants/index';
import { HIGHLIGHTER_POPUP_DISPLAY_DELTA } from '@constants/styles';

import { getWordListStorageKey } from './storage';
import { toCapitalize } from './stringHelpers';

export const constructWordExample = (example = '') => {
  const punc = example.length > 0 && ['.', '?', '!'].indexOf(example.slice(-1)) === -1 ? '.' : '';
  return `${toCapitalize(example)}${punc}`;
};

export const genHighlightSyntax = ({ config, orgWord }) => {
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[config.highlightColor];
  const highlightWord = `<span class="${HIGHLIGHTER_ORG_WORD_CLASS} ${highlightColorClass}">${orgWord}</span>`;
  return `<span class="${HIGHLIGHTER_CLASS}" tabindex="0">${highlightWord}</span>`;
};

export const getAllWords = async locale => {
  const key = getWordListStorageKey(locale);
  const cache = await getStorage({ type: 'local', key });
  const wordList = cache[key]; // Background has stored the data on install

  if (!wordList) {
    return new Map([]);
  }

  return new Map(wordList.map(item => [item.word, item]));
};

export const getDetailDisplayPos = ({ x, y, offsetX, offsetY, maxX, width }) => {
  const xx = Math.max(0, x + offsetX + HIGHLIGHTER_POPUP_DISPLAY_DELTA - Math.max(0, x + offsetX + HIGHLIGHTER_POPUP_DISPLAY_DELTA + width - maxX));
  const yy = y + offsetY + HIGHLIGHTER_POPUP_DISPLAY_DELTA;
  return { x: xx, y: yy };
};
