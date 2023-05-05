import React from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

const Section = ({ children }) => (
  <Box
    sx={{
      backgroundColor: 'rgb(253 253 253)',
      padding: '14px',
      borderRadius: '6px',
      border: '0px',
    }}
  >
    {children}
  </Box>
);

Section.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

Section.defaultProps = {
  children: null,
};
export default Section;
