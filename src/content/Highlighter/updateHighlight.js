import { HIGHLIGHTER_BG_COLOR_CLASS, HIGHLIGHTER_ORG_WORD_CLASS } from '@constants/index';

/*
 * Note: the complexity of this file is greatly reduced by moving the impl. of the detial popup to react component
 */

const updateNode = (node, { highlightColor }) => {
  const { classList } = node;
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[highlightColor];

  classList.remove(...classList);
  classList.add(HIGHLIGHTER_ORG_WORD_CLASS);
  classList.add(highlightColorClass);
};

const shouldUpdate = (config, prevConfig) => {
  const keys = ['highlightColor'];
  return keys.some(key => config[key] !== prevConfig[key]);
};

export const tryUpdateWebContent = (config, prevConfig = {}) => {
  if (!config || !shouldUpdate(config, prevConfig)) {
    return;
  }
  [...document.getElementsByClassName(HIGHLIGHTER_ORG_WORD_CLASS)].forEach(node => updateNode(node, config));
};
