import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const BaseWrapper = ({ children }) => (
  <Box
    sx={{
      padding: '12px',
      backgroundColor: '#f1f3f4',
    }}
  >
    {children}
  </Box>
);

BaseWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

BaseWrapper.defaultProps = {
  children: null,
};
export default BaseWrapper;
