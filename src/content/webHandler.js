import {
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DEF_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_HIDDEN_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_ICON_CLASS,
  // HIGHLIGHTER_LINK_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_POS_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  LANGS,
  ONLINE_DIC_URL,
} from '@shared/constants';
import { genHighlightSyntax } from '@shared/utils/highlight';

export const getAllNodesFromDOM = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let currNode = walker.currentNode;
  let nodes = [];
  while (currNode) {
    nodes = [...nodes, currNode];
    currNode = walker.nextNode();
  }
  return nodes;
};

export const findWordsInNodes = ({ nodeValue, words }) => {
  const parsed = nodeValue
    .replace(/[^a-z]/gi, ' ')
    .split(' ')
    .filter(val => val && words.has(val.toLowerCase()));
  return [...new Set(parsed)];
};

export const highlightMatchedWords = ({ config, nodeValue, matchedWords, words }) => {
  let value = nodeValue;
  matchedWords.forEach(word => {
    const arg = { config, orgWord: word, word: words.get(word.toLowerCase()) };
    value = value.replace(word, genHighlightSyntax(arg)); // TODO if target word is 'the', then 'therefore' will be effected
  });
  return value;
};

export const shouldAddHighlight = node =>
  node.parentNode != null &&
  node.parentNode.tagName !== 'STYLE' &&
  node.parentNode.tagName !== 'SCRIPT' &&
  node.parentNode.tagName !== 'NOSCRIPT' &&
  !node.parentNode.classList.contains(HIGHLIGHTER_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_DEF_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_ICON_CLASS) &&
  node.nodeValue &&
  node.nodeValue.trim().length;

export const shouldUpdate = node =>
  node.parentNode != null &&
  (node.parentNode.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS) ||
    // node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_POS_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DEF_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_ICON_CLASS));

export const detectExtensionElementCategory = classList => {
  let category = -1;
  if (classList.contains(HIGHLIGHTER_ORG_WORD_CLASS)) {
    category = HIGHLIGHTER_ORG_WORD_CLASS;
  } else if (classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS)) {
    category = HIGHLIGHTER_TARGET_WORD_CLASS;
    // } else if (classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS)) {
    //   category = HIGHLIGHTER_DETAIL_ITEM_CLASS;
  } else if (classList.contains(HIGHLIGHTER_POS_CLASS)) {
    category = HIGHLIGHTER_POS_CLASS;
  } else if (classList.contains(HIGHLIGHTER_DEF_CLASS)) {
    category = HIGHLIGHTER_DEF_CLASS;
  } else if (classList.contains(HIGHLIGHTER_ICON_CLASS)) {
    category = HIGHLIGHTER_ICON_CLASS;
  }

  return category;
};

// See @shared/utils/highlight.js for more details
export const updateNode = (node, { language, showDetail, highlightColorClass, fontSizeClass }) => {
  const { parentNode } = node;
  const { classList } = parentNode;
  const category = detectExtensionElementCategory(classList);

  if (category === HIGHLIGHTER_TARGET_WORD_CLASS) {
    let detailPopupNode = parentNode.parentNode;
    while (!detailPopupNode.classList.contains(HIGHLIGHTER_DETAIL_CLASS)) {
      detailPopupNode = detailPopupNode.parentNode;
    }
    if (showDetail) {
      detailPopupNode.classList.remove(HIGHLIGHTER_DETAIL_HIDDEN_CLASS);
    } else {
      detailPopupNode.classList.add(HIGHLIGHTER_DETAIL_HIDDEN_CLASS);
    }
  }

  classList.remove(...classList);
  if (category === HIGHLIGHTER_ORG_WORD_CLASS) {
    classList.add(HIGHLIGHTER_ORG_WORD_CLASS);
    classList.add(highlightColorClass);
  } else if (category === HIGHLIGHTER_TARGET_WORD_CLASS) {
    classList.add(HIGHLIGHTER_TARGET_WORD_CLASS);
    classList.add(fontSizeClass);
    // } else if (category === HIGHLIGHTER_DETAIL_ITEM_CLASS) {
    //   // When a vocabulary does not have example, we'll miss this case and not changing the font size
    //   classList.add(HIGHLIGHTER_DETAIL_ITEM_CLASS);
    //   classList.add(fontSizeClass);
  } else if (category === HIGHLIGHTER_POS_CLASS) {
    classList.add(HIGHLIGHTER_POS_CLASS);
    parentNode.parentNode.classList.remove(...parentNode.parentNode.classList);
    parentNode.parentNode.classList.add(HIGHLIGHTER_DETAIL_ITEM_CLASS);
    parentNode.parentNode.classList.add(fontSizeClass);
  } else if (category === HIGHLIGHTER_DEF_CLASS) {
    classList.add(HIGHLIGHTER_DEF_CLASS);
    const def = parentNode.dataset[`${LANGS[language].toLowerCase()}`] || parentNode.dataset[LANGS.en];
    // eslint-disable-next-line no-param-reassign
    node.nodeValue = def;
  } else if (category === HIGHLIGHTER_ICON_CLASS) {
    const { word } = parentNode.dataset;
    const link = `${ONLINE_DIC_URL[language]}${word}`;
    classList.add(HIGHLIGHTER_ICON_CLASS);
    parentNode.href = link;
  }
};
