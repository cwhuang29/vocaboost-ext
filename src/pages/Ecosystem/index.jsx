import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SectionWrapper } from '@components/styledComponents/SectionWrapper';
import messages from '@constants/messages';

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Box, Chip, Typography, useMediaQuery } from '@mui/material';

import Modal from './Modal';
import { scenarioFlows } from './scenarioFlows';

const FlowChip = ({ flow, onClick }) => (
  <Chip
    clickable
    label={flow.label}
    icon={flow.icon}
    sx={{
      backgroundColor: '#EBEBEB',
      height: '45px',
      borderRadius: '23px',
      fontSize: '1.24rem',
      padding: '0 5px',
      margin: '0 min(32px, 2.2%) 16px min(32px, 2.2%)',
    }}
    onClick={() => onClick(flow.info)}
  />
);

const FlowIntro = ({ detail }) => (
  <div style={{ padding: '35px min(40px, 3%)', display: 'flex', justifyContent: 'center' }}>
    <img src={detail.image} alt='' height='380' style={{ borderRadius: '20px', width: 'min(40%, 550px)' }} />
    <div style={{ width: 'min(10%, 100px)' }} />
    <Typography variant='h6' component='div' sx={{ width: '45%', whiteSpace: 'pre-line' }}>
      {detail.content}
    </Typography>
  </div>
);

const Ecosystem = () => {
  const { ecosystem } = useParams();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const minWidthCheck = useMediaQuery('(min-width:920px)'); // Equals to true when screen width is larger than # px

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleContent = modalInfo => setInfo(modalInfo);
  const flowChipOnClick = (currInfo = { title: messages.MISSING, content: '' }) => {
    handleOpen();
    handleContent({ title: currInfo.title, content: currInfo.content });
  };

  let scenario = scenarioFlows[ecosystem];
  scenario = scenarioFlows.workers; // For final presentation

  return (
    <Box
      sx={{ color: '#EFEFEF' }}
      style={{
        height: '100%',
      }}
    >
      {minWidthCheck && (
        <>
          <img
            src='/assets/mascot/mascot_gif.gif'
            alt='SnY mascot'
            width='250'
            style={{
              position: 'absolute',
              top: '100px',
              left: '95px',
              transform: 'scaleX(-1)',
              WebkitTransform: 'scaleX(-1)',
            }}
          />
          <img
            src='/assets/mascot/mascot_gif.gif'
            alt='SnY mascot'
            width='250'
            style={{
              position: 'absolute',
              top: '100px',
              right: '95px',
            }}
          />
        </>
      )}

      <Modal open={open} onClose={handleClose} info={info} />

      {scenario.map(flow => (
        <SectionWrapper padding={minWidthCheck ? '8.2em 0' : '1.7em 0'} background={flow.backgroundColor} key={flow.title}>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {flow.title}
          </Typography>
          <Box style={{ textAlign: 'center', paddingTop: minWidthCheck ? '35px' : '15px' }}>
            {flow.flow.map((stage, idx) => (
              <React.Fragment key={stage.label}>
                <FlowChip flow={stage} onClick={flowChipOnClick} />
                {idx !== flow.flow.length - 1 && <DoubleArrowIcon sx={{ color: '#5B5B5B', fontSize: '31px', position: 'relative', top: '7px' }} />}
              </React.Fragment>
            ))}
          </Box>
        </SectionWrapper>
      ))}

      {
        // flowDetail.map((detail) => (
        //   <React.Fragment key={detail.title}>
        //     <SectionWrapper padding='4em 0 1.8em 0' background={detail.backgroundColor}>
        //       <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center', cursor: 'default' }}>
        //         {detail.title}
        //       </Typography>
        //       <FlowIntro detail={detail} />
        //     </SectionWrapper>
        //   </React.Fragment>
        // ))
      }
    </Box>
  );
};

FlowChip.propTypes = {
  flow: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

FlowIntro.propTypes = {
  detail: PropTypes.object.isRequired,
};

export default Ecosystem;
