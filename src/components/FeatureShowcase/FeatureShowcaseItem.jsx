import React from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@mui/material';

const FeatureShowcaseItem = ({ feature }) => (
  <Box
    sx={{
      ml: 'auto',
      mr: 'auto',
      maxWidth: 300,
      textAlign: 'center',
    }}
  >
    {feature.icon}
    <Typography variant='h5' component='div' sx={{ paddingBottom: '15px', fontWeight: 'bold', whiteSpace: 'pre' }}>
      {feature.title}
    </Typography>
    <Typography variant='body1' component='div' sx={{}}>
      {feature.content}
    </Typography>
  </Box>
);

FeatureShowcaseItem.propTypes = {
  feature: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    icon: PropTypes.element.isRequired,
  }).isRequired,
};

export default FeatureShowcaseItem;
