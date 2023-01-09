import React from 'react';
import PropTypes from 'prop-types';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';

import { HIGHLIGHTER_CLASS, HIGHLIGHTER_POS_CLASS, LANGS, ONLINE_DIC_URL, PARTS_OF_SPEECH_SHORTHAND } from '@constants/index';
import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { constructWordExample } from '@utils/highlight';

const Word = ({ word }) => (
  <Typography variant='h4' component='div' className={HIGHLIGHTER_CLASS} style={{ textTransform: 'capitalize' }}>
    {word}
  </Typography>
);

const Divider = () => <hr style={{ position: 'relative', bottom: '3px', backgroundColor: '#EDEDED', border: '0.8px solid #EDEDED' }} />;

const PartsOfSpeech = ({ partsOfSpeech }) => {
  const pos = PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech];
  return pos ? (
    <span className={HIGHLIGHTER_POS_CLASS} style={{ marginRight: '6px' }}>
      {pos}
    </span>
  ) : null;
};

const Meaning = ({ language, meaning }) => {
  const l = language === LANGS.zh_CN ? LANGS.zh_TW : language; // For now use zh_TW's value for zh_CN
  const def = meaning[LANGS[l]] || meaning[LANGS.en];
  return <span className={HIGHLIGHTER_CLASS}>{def}</span>;
};

const Example = ({ example }) => <span className={HIGHLIGHTER_CLASS}>{constructWordExample(example)}</span>;

const DailyWord = ({ language }) => {
  const { dailyWord = {} } = useExtensionMessageContext(); // This might takes a bit time (get/update daily word -> insert to storage -> update context)
  const { word, detail } = dailyWord;
  const link = `${ONLINE_DIC_URL[language]}${word}`;

  const openExternalLink = () => {
    window.open(link, '_blank', 'noopener, noreferrer');
  };

  return word ? (
    <Box style={{ color: 'rgb(27 31 50)' }}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Word word={word} />
        <Box style={{ width: '20px' }} />
        <MenuBookIcon onClick={openExternalLink} style={{ cursor: 'pointer', fontSize: '36px' }} />
      </Box>
      <Divider />
      {detail.map(({ meaning, partsOfSpeech, example }, idx) => (
        <React.Fragment key={idx}>
          <Typography variant='body1' component='div' style={{ marginBottom: idx === detail.length - 1 ? '0px' : '6px' }}>
            <PartsOfSpeech partsOfSpeech={partsOfSpeech} />
            <Meaning language={language} meaning={meaning} />
            <br />
            <Example example={example} />
          </Typography>
          {/* <Link href={link} target='_blank' rel='noopener noreferrer' style={{}}> Check out on dictionary </Link> */}
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
