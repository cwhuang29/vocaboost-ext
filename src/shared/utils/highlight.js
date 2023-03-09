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
import { HIGHLIGHTER_BG_COLOR_CLASS, HIGHLIGHTER_CLASS, HIGHLIGHTER_ORG_WORD_CLASS } from '@constants/index';

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
