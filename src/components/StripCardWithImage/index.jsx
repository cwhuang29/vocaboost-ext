import React from 'react';
import PropTypes from 'prop-types';

import { Box, createTheme, Grid, ThemeProvider } from '@mui/material';

import StripCardWithImageItem from './StripCardWithImageItem';

// https://mui.com/customization/breakpoints
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

const StripCardWithImage = ({ scenarios }) => (
  <ThemeProvider theme={theme}>
    <Box>
      <Grid container rowSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} columnSpacing={{ sm: 2, md: 3, lg: 4 }}>
        {scenarios.map(scenario => (
          <Grid item xs={12} sm={12} md={6} key={scenario.title}>
            <StripCardWithImageItem prop={scenario} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </ThemeProvider>
);

StripCardWithImage.propTypes = {
  scenarios: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default StripCardWithImage;
