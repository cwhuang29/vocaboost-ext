import React from 'react';
import PropTypes from 'prop-types';

import { Box, ListItemButton, ListItemText } from '@mui/material';

const SubmitAndCancelButtonGroup = props => {
  const { disabledSubmit, disabledCancel, onSubmit, onCancel, submitButtonText, cancelButtonText } = props;

  const wrapperStyle = { display: 'flex', justifyContent: 'space-evenly', maxWidth: '700px', margin: '30px auto 0 auto' };
  const cancelCursorStyle = { cursor: disabledCancel ? 'wait' : 'default' };
  const submitCursorStyle = { cursor: disabledSubmit ? 'wait' : 'default' };
  const listItemButtonStyle = {
    maxWidth: '240px',
    minWidth: '165px',
    borderRadius: '4px',
    // '&.Mui-disabled': { cursor: 'wait !important', backgroundColor: 'green !important' }, // Can't apply cursor style
  };
  const listItemTextStyle = { textAlign: 'center', fontWeight: '700', color: '#EDEDED' };

  return (
    <Box style={wrapperStyle}>
      <Box style={cancelCursorStyle}>
        <ListItemButton disabled={disabledCancel} sx={{ ...listItemButtonStyle, backgroundColor: '#F95C5C' }} onClick={onCancel}>
          <ListItemText primary={cancelButtonText} style={listItemTextStyle} />
        </ListItemButton>
      </Box>
      <div style={{ width: '9%' }} />
      <Box style={submitCursorStyle}>
        <ListItemButton disabled={disabledSubmit} sx={{ ...listItemButtonStyle, backgroundColor: '#4778DD' }} onClick={onSubmit}>
          <ListItemText primary={submitButtonText} style={listItemTextStyle} />
        </ListItemButton>
      </Box>
    </Box>
  );
};

SubmitAndCancelButtonGroup.propTypes = {
  disabledSubmit: PropTypes.bool,
  disabledCancel: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
};

SubmitAndCancelButtonGroup.defaultProps = {
  disabledSubmit: false,
  disabledCancel: false,
  cancelButtonText: '取消',
};

export default SubmitAndCancelButtonGroup;
