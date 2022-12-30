import React from 'react';
import PropTypes from 'prop-types';

import { Box, Modal as MuiModal, Typography } from '@mui/material';

const Modal = props => {
  const {
    open,
    onClose,
    info: { title, content },
  } = props;

  return (
    <MuiModal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#EBEBEB',
          border: 'none',
          borderRadius: '12px',
          boxShadow: 25,
          p: 5,
        }}
        style={{
          width: 'min(690px, 70%)',
          maxWidth: '70%',
        }}
      >
        <Typography id='modal-modal-title' variant='h5' style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </Typography>
        <Typography id='modal-modal-description' sx={{ mt: 2 }} style={{ whiteSpace: 'pre-line' }}>
          {content}
        </Typography>
      </Box>
    </MuiModal>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
};

export default Modal;
