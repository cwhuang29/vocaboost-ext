import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, Typography } from '@mui/material';

import { HIGHLIGHTER_CLASS, HIGHLIGHTER_POS_CLASS, LANGS, ONLINE_DIC_URL, PARTS_OF_SPEECH_SHORTHAND } from '@constants/index';
import { DEFAULT_SPEECH_RATE } from '@constants/styles';
import { getLocalDate } from '@utils/time';
import { genWordDetailList } from '@utils/word';

import { popupSettingActionType } from './action';

const Word = ({ word }) => (
  <Typography variant='body1' component='div' className={HIGHLIGHTER_CLASS} style={{ textTransform: 'capitalize' }}>
    {word}
  </Typography>
);

const PartsOfSpeech = ({ partsOfSpeech }) => {
  const pos = PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech];
  return pos ? (
    <span className={HIGHLIGHTER_POS_CLASS} style={{ marginRight: '3px' }}>
      {pos}
    </span>
  ) : null;
};

const Meaning = ({ language, meaning }) => {
  const def = meaning[LANGS[language]] || meaning[LANGS.en];
  return <span className={HIGHLIGHTER_CLASS}>{def}</span>;
};

const CollectedWords = ({ config, handleChange }) => {
  const { language, collectedWords } = config;
  const wordListMapping = useMemo(() => new Map(genWordDetailList().map(item => [item.id, item])), []);
  const words = collectedWords.map(wordId => wordListMapping.get(wordId)).filter(word => word);
  const msg = new SpeechSynthesisUtterance();
  msg.rate = DEFAULT_SPEECH_RATE;

  const menuBookIconOnClick = word => () => {
    const link = `${ONLINE_DIC_URL[language]}${word}`;
    window.open(link, '_blank', 'noopener, noreferrer');
  };

  const speakerIconOnClick = word => () => {
    msg.text = word;
    window.speechSynthesis.speak(msg);
  };

  const starIconOnClick = id => () => {
    handleChange({
      type: popupSettingActionType.OVERRIDE_ALL,
      payload: { ...config, collectedWords: config.collectedWords.filter(wordId => wordId !== id), updatedAt: getLocalDate() },
    });
  };

  const iconStyle = { cursor: 'pointer', fontSize: '20px', marginLeft: '6%' };

  return (
    <Box style={{ maxHeight: '245px', overflowY: 'auto' }}>
      {words.map(({ id, word, detail }, wordIdx) => (
        <Box key={id}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Word word={word} />
            <Box style={{ marginLeft: 'auto' }} />
            <MenuBookIcon onClick={menuBookIconOnClick(word)} style={iconStyle} />
            <VolumeUpIcon onClick={speakerIconOnClick(word)} style={iconStyle} />
            <StarIcon
              onClick={starIconOnClick(id)}
              style={{ ...iconStyle, filter: 'invert(82%) sepia(47%) saturate(2207%) hue-rotate(356deg) brightness(102%) contrast(107%)' }}
            />
          </Box>
          {detail.map(({ meaning, partsOfSpeech }, detailIdx) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`${id}-${detailIdx}`}>
              <Typography variant='body2' component='div' style={{ marginBottom: detailIdx === detail.length - 1 ? '0px' : '3px' }}>
                <PartsOfSpeech partsOfSpeech={partsOfSpeech} />
                <Meaning language={language} meaning={meaning} />
              </Typography>
            </React.Fragment>
          ))}
          {wordIdx !== words.length - 1 && <Box style={{ marginBottom: '6.5px' }} />}
        </Box>
      ))}
    </Box>
  );
};

Word.propTypes = {
  word: PropTypes.string.isRequired,
};

PartsOfSpeech.propTypes = {
  partsOfSpeech: PropTypes.string.isRequired,
};

Meaning.propTypes = {
  language: PropTypes.string.isRequired,
  meaning: PropTypes.object.isRequired,
};

CollectedWords.propTypes = {
  config: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default React.memo(CollectedWords);
