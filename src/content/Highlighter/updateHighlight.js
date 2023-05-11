import { HIGHLIGHTER_BG_COLOR_CLASS, HIGHLIGHTER_ORG_WORD_CLASS } from '@constants/index';
import { setURLToConfigFormat } from '@utils/config';
import { isObjectEmpty } from '@utils/misc';

const getAllHighlightWordNodes = () => [...document.getElementsByClassName(HIGHLIGHTER_ORG_WORD_CLASS)];

const clearNodeStyle = node => {
  const { classList } = node;

  classList.remove(...classList);
  classList.add(HIGHLIGHTER_ORG_WORD_CLASS);
};

const updateNodeStyle = (node, { highlightColor }) => {
  const { classList } = node;
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[highlightColor];

  classList.remove(...classList);
  classList.add(HIGHLIGHTER_ORG_WORD_CLASS);
  classList.add(highlightColorClass);
};

const shouldClearStyle = config => config.suspendedPages.includes(setURLToConfigFormat(window.location));

const shouldUpdateStyle = (config, prevConfig) => {
  if (isObjectEmpty(prevConfig)) {
    return true;
  }

  const url = setURLToConfigFormat(window.location);
  const nowSuspending = config.suspendedPages.includes(url);
  const prevSuspended = prevConfig.suspendedPages.includes(url);
  if (!nowSuspending && prevSuspended) {
    return true;
  }

  const keys = ['highlightColor'];
  return keys.some(key => config[key] !== prevConfig[key]);
};

export const updateWebContent = (config, prevConfig = {}) => {
  if (!config) {
    return;
  }

  const nodes = getAllHighlightWordNodes();

  if (shouldClearStyle(config)) {
    nodes.forEach(node => clearNodeStyle(node));
    return;
  }

  if (shouldUpdateStyle(config, prevConfig)) {
    nodes.forEach(node => updateNodeStyle(node, config));
  }
};
