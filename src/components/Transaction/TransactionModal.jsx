import React from 'react';
import PropTypes from 'prop-types';

import TransactionList from '@components/Transaction/TransactionList';

import { Box, Modal as MuiModal, Typography } from '@mui/material';

const TransactionModal = props => {
  const {
    open,
    onClose,
    info: { title, content },
  } = props;

  return (
    <MuiModal open={open} onClose={onClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#EDEDED',
          border: 'none',
          borderRadius: '12px',
          boxShadow: 25,
          p: 2,
        }}
        style={{
          width: 'min(690px, 70%)',
          maxWidth: '70%',
        }}
      >
        <Typography id='modal-modal-title' variant='h5' style={{ fontWeight: 'bold', textAlign: 'center', paddingTop: '12px' }}>
          {title}
        </Typography>
        <TransactionList content={content} />
      </Box>
    </MuiModal>
  );
};

TransactionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
};

export default TransactionModal;
