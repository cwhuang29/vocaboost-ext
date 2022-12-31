import {
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_ICON_CLASS,
  // HIGHLIGHTER_LINK_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
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

export const detectExtensionElementCategory = classList => {
  let category = -1;
  if (classList.contains(HIGHLIGHTER_ORG_WORD_CLASS)) {
    category = HIGHLIGHTER_ORG_WORD_CLASS;
  } else if (classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS)) {
    category = HIGHLIGHTER_TARGET_WORD_CLASS;
  } else if (classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS)) {
    category = HIGHLIGHTER_DETAIL_ITEM_CLASS;
  } else if (classList.contains(HIGHLIGHTER_ICON_CLASS)) {
    category = HIGHLIGHTER_ICON_CLASS;
    // } else if (classList.contains(HIGHLIGHTER_LINK_CLASS)) {
    //   category =HIGHLIGHTER_LINK_CLASS;
  }

  return category;
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
  node.nodeValue &&
  node.nodeValue.trim().length;

export const shouldUpdate = node =>
  node.parentNode != null &&
  (node.parentNode.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_ICON_CLASS));
// node.parentNode.classList.contains(HIGHLIGHTER_LINK_CLASS));
