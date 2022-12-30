import React from 'react';

import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { HIGHLIGHTER_CLASS, HIGHLIGHTER_POS_CLASS, LANGS, ONLINE_DIC_URL, PARTS_OF_SPEECH_SHORTHAND } from '@shared/constants';
import { constructWordExample } from '@shared/utils/highlight';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Typography } from '@mui/material';

const Divider = () => <hr style={{ position: 'relative', bottom: '3px', backgroundColor: '#EDEDED', border: '0.8px solid #EDEDED' }} />;

const DailyWord = ({ language }) => {
  const { dailyWord = {} } = useExtensionMessageContext(); // This might takes a bit time (get/update daily word -> insert to storage -> update context)
  const { word, detail } = dailyWord;
  const link = `${ONLINE_DIC_URL[language]}${word}`;

  const openExternalLink = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return word ? (
    <Box style={{ color: 'rgb(27 31 50)' }}>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h4' component='div' className={HIGHLIGHTER_CLASS} style={{ textTransform: 'capitalize' }}>
          {word}
        </Typography>
        <Box style={{ width: '22px' }} />
        <MenuBookIcon onClick={openExternalLink} style={{ cursor: 'pointer', fontSize: '38px' }} />
      </Box>
      <Divider />
      {detail.map(({ meaning, partsOfSpeech, example }) => (
        <>
          <Typography variant='body1' component='div' className={HIGHLIGHTER_CLASS} style={{ fontWeight: 'normal', marginBottom: '5px' }}>
            <span className={HIGHLIGHTER_POS_CLASS}>{PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech]}&nbsp;&nbsp;</span>
            {meaning[LANGS.en]} {/* for now only english explanation is supported */}
          </Typography>
          <Typography variant='body1' component='div' className={HIGHLIGHTER_CLASS} style={{ fontWeight: 'normal', marginBottom: '5px' }}>
            {constructWordExample(example)}
          </Typography>
          {/* <Link href={link} target='_blank' rel='noopener noreferrer' style={{}}> Check out on dictionary </Link> */}
        </>
      ))}
    </Box>
  ) : (
    <Box>Loading daily word...</Box>
  );
};

DailyWord.propTypes = {
  language: PropTypes.string.isRequired,
};

export default DailyWord;
