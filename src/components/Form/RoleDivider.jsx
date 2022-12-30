import React from 'react';
import PropTypes from 'prop-types';

import { Box, Chip } from '@mui/material';

export const RoleDivider = props => {
  const { display, icon } = props;

  return (
    <Box style={{ position: 'relative', textAlign: 'center', padding: '30px 0 0px' }}>
      <Chip
        // clickable
        label={display}
        icon={icon}
        sx={{
          backgroundColor: '#84B2BB',
          height: '45px',
          borderRadius: '23px',
          fontSize: '1.24rem',
          padding: '0 5px',
        }}
      />
      <hr style={{ position: 'relative', bottom: '33px', border: '0.8px solid #AAAAAA', zIndex: -10 }} />
    </Box>
  );
};

RoleDivider.propTypes = {
  display: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};
