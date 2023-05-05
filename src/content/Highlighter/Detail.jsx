import React from 'react';
import Browser from 'webextension-polyfill';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import menuBookIcon from '@/../assets/svgs/menu_book.svg';
import speakerIcon from '@/../assets/svgs/speaker.svg';
import starIcon from '@/../assets/svgs/star.svg';
import { LANGS_SUPPORTED } from '@constants/i18n';
import {
  HIGHLIGHTER_COLLECTED,
  HIGHLIGHTER_DEF_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_EXAMPLE_CLASS,
  HIGHLIGHTER_FONT_SIZE_CLASS,
  HIGHLIGHTER_ICON_CLASS,
  HIGHLIGHTER_NOT_COLLECTED,
  HIGHLIGHTER_POS_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  ONLINE_DIC_URL,
  PARTS_OF_SPEECH_SHORTHAND,
} from '@constants/index';
import { DEFAULT_SPEECH_RATE } from '@constants/styles';
import { constructWordExample } from '@utils/highlight';

const Word = ({ word, fontSize }) => <div className={`${HIGHLIGHTER_TARGET_WORD_CLASS} ${HIGHLIGHTER_FONT_SIZE_CLASS[fontSize]}`}>{word}</div>;

// Note that width attribute of img tag might be override. It is better to set both
const Link = ({ word, href, img }) => (
  <a className={HIGHLIGHTER_ICON_CLASS} href={href} data-word={word} target='_blank' rel='noopener noreferrer'>
    <img className={HIGHLIGHTER_NOT_COLLECTED} src={img} alt='link to online dict' width={26} style={{ width: '26px' }} />
  </a>
);

const SpeakerButton = ({ img, word }) => {
  const msg = new SpeechSynthesisUtterance();
  msg.rate = DEFAULT_SPEECH_RATE;
  msg.text = word;

  const onClick = () => {
    window.speechSynthesis.speak(msg);
  };
  return (
    <button className={HIGHLIGHTER_ICON_CLASS} onClick={onClick} type='button' style={{ backgroundColor: 'inherit', border: '0px' }}>
      <img className={HIGHLIGHTER_NOT_COLLECTED} src={img} alt='speaker button' width={24} style={{ width: '24px' }} />
    </button>
  );
};

// CSS '!important' is not working properly. See: https://github.com/facebook/react/issues/1881#issuecomment-262257503
const StarButton = ({ id, isCollected, img, onClick }) => (
  <button
    className={HIGHLIGHTER_ICON_CLASS}
    onClick={onClick({ id, isCollected })}
    type='button'
    style={{ backgroundColor: 'inherit', border: '0px' }}
    ref={node => node && node.style.setProperty('margin-left', 'auto', 'important')}
  >
    <img className={isCollected ? HIGHLIGHTER_COLLECTED : HIGHLIGHTER_NOT_COLLECTED} src={img} alt='star button' width={24} style={{ width: '24px' }} />
  </button>
);

const DetailItem = ({ fontSize, children }) => <div className={`${HIGHLIGHTER_DETAIL_ITEM_CLASS} ${HIGHLIGHTER_FONT_SIZE_CLASS[fontSize]}`}>{children}</div>;

const PartsOfSpeech = ({ partsOfSpeech }) => <span className={HIGHLIGHTER_POS_CLASS}>{PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech]}</span>;

const Definition = ({ language, meaning }) => <span className={HIGHLIGHTER_DEF_CLASS}>{meaning[LANGS_SUPPORTED[language]]}</span>;

const Example = ({ example }) => <span className={HIGHLIGHTER_EXAMPLE_CLASS}>{constructWordExample(example)}</span>;

const Detail = ({ display, posStyle, wordData, language, fontSize, isCollected, onCollectWord }) =>
  display && (
    <Box className={HIGHLIGHTER_DETAIL_CLASS} style={posStyle}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Word word={wordData.word} fontSize={fontSize} />
        <Link img={Browser.runtime.getURL(menuBookIcon)} word={wordData.word} href={`${ONLINE_DIC_URL[language]}${wordData.word}`} />
        <SpeakerButton img={Browser.runtime.getURL(speakerIcon)} word={wordData.word} />
        <StarButton img={Browser.runtime.getURL(starIcon)} id={wordData.id} isCollected={isCollected} onClick={onCollectWord} />
      </Box>
      {wordData.detail.map(
        ({ meaning, partsOfSpeech, example }) =>
          partsOfSpeech && (
            <DetailItem fontSize={fontSize} key={`${partsOfSpeech}-${example.slice(0, 10)}`}>
              <PartsOfSpeech partsOfSpeech={partsOfSpeech} />
              <Definition language={language} meaning={meaning} />
              <br />
              <Example example={example} />
            </DetailItem>
          )
      )}
    </Box>
  );

Word.propTypes = {
  word: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
};

Link.propTypes = {
  word: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
};

StarButton.propTypes = {
  id: PropTypes.number.isRequired,
  isCollected: PropTypes.bool.isRequired,
  img: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

SpeakerButton.propTypes = {
  img: PropTypes.string.isRequired,
  word: PropTypes.string.isRequired,
};

DetailItem.propTypes = {
  fontSize: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

PartsOfSpeech.propTypes = {
  partsOfSpeech: PropTypes.string.isRequired,
};

Definition.propTypes = {
  language: PropTypes.string.isRequired,
  meaning: PropTypes.object.isRequired,
};

Example.propTypes = {
  example: PropTypes.string.isRequired,
};

Detail.propTypes = {
  display: PropTypes.bool.isRequired,
  posStyle: PropTypes.object.isRequired,
  wordData: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  isCollected: PropTypes.bool.isRequired,
  onCollectWord: PropTypes.func.isRequired,
};

export default Detail;
