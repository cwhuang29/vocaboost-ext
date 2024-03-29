import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, Typography } from '@mui/material';

import LANGS from '@constants/i18n';
import { HIGHLIGHTER_CLASS, HIGHLIGHTER_POS_CLASS, ONLINE_DIC_URL, PARTS_OF_SPEECH_SHORTHAND } from '@constants/index';
import { DEFAULT_SPEECH_RATE } from '@constants/styles';
import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { constructWordExample } from '@utils/highlight';

const Word = ({ word }) => (
  <Typography variant='h6' component='div' className={HIGHLIGHTER_CLASS} style={{ textTransform: 'capitalize' }}>
    {word}
  </Typography>
);

const Divider = () => <hr style={{ position: 'relative', bottom: '2.5px', backgroundColor: '#EDEDED', border: '0.8px solid #EDEDED' }} />;

const PartsOfSpeech = ({ partsOfSpeech }) => {
  const pos = PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech];
  return pos ? (
    <span className={HIGHLIGHTER_POS_CLASS} style={{ marginRight: '6px' }}>
      {pos}
    </span>
  ) : null;
};

const Meaning = ({ language, meaning }) => {
  const def = meaning[LANGS[language]] || meaning[LANGS.en];
  return <span className={HIGHLIGHTER_CLASS}>{def}</span>;
};

const Example = ({ example }) => <span className={HIGHLIGHTER_CLASS}>{constructWordExample(example)}</span>;

const DailyWord = ({ language }) => {
  const [msg, setMsg] = useState(null);
  const { dailyWord = {} } = useExtensionMessageContext(); // This might takes a bit time (get/update daily word -> insert to storage -> update context)
  const { word, detail } = dailyWord;
  const link = `${ONLINE_DIC_URL[language]}${word}`;

  useEffect(() => {
    const m = new SpeechSynthesisUtterance();
    m.rate = DEFAULT_SPEECH_RATE;
    setMsg(m);
  }, []);

  const speakerIconOnClick = w => () => {
    msg.text = w;
    window.speechSynthesis.speak(msg);
  };

  const openExternalLink = () => {
    window.open(link, '_blank', 'noopener, noreferrer');
  };

  const iconStyle = { cursor: 'pointer', fontSize: '25px', marginLeft: '3%' };

  return word ? (
    <Box style={{ marginTop: '-10px' }}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Word word={word} />
        <MenuBookIcon onClick={openExternalLink} style={iconStyle} />
        <VolumeUpIcon onClick={speakerIconOnClick(word)} style={iconStyle} />
      </Box>
      <Divider />
      {detail.map(({ meaning, partsOfSpeech, example }, idx) => (
        <React.Fragment key={`${partsOfSpeech}-${example.slice(0, 10)}`}>
          <Typography
            variant='body1'
            component='div'
            style={{ lineHeight: '21px', marginBottom: idx === detail.length - 1 ? '0px' : '5px', fontSize: '15.5px' }}
          >
            <PartsOfSpeech partsOfSpeech={partsOfSpeech} />
            <Meaning language={language} meaning={meaning} />
            <br />
            <Example example={example} />
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  ) : (
    <Box>Loading daily word...</Box>
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

Example.propTypes = {
  example: PropTypes.string.isRequired,
};

DailyWord.propTypes = {
  language: PropTypes.string.isRequired,
};

/*
 * Whenever the dailyWord in the context or language from the prop changes, this component rerenders
 * Since language is passed down from parent element, it is prepared in the beginning
 * The initial value of dailyWord is null due to parent element has to make some async requests to prepare it
 * As a result, this component will rerender later when dailyWord has updated
 */
export default React.memo(DailyWord);
