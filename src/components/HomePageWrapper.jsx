import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

const PageWrapper = ({ children }) => (
  <Box
    sx={{
      margin: '20px auto 0 auto',
      padding: '0 48px',
      textAlign: 'center',
      overflowX: 'hidden',
      maxWidth: '1800px',
    }}
  >
    {children}
  </Box>
);

PageWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

PageWrapper.defaultProps = {
  children: null,
};

export default PageWrapper;
