import React from 'react';
import PropTypes from 'prop-types';

import FeatureShowcaseItem from '@components/FeatureShowcase/FeatureShowcaseItem';

import { Box, createTheme, Grid, ThemeProvider } from '@mui/material';

// https://mui.com/customization/breakpoints/
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 750,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
});

const FeatureShowcase = ({ features }) => (
  <ThemeProvider theme={theme}>
    <Box>
      <Grid container rowSpacing={{ sm: 1, md: 2, lg: 3 }} columnSpacing={{ sm: 2, md: 4, lg: 5 }}>
        {features.map(feature => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <FeatureShowcaseItem feature={feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  </ThemeProvider>
);

FeatureShowcase.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string,
      icon: PropTypes.element.isRequired,
    }).isRequired
  ).isRequired,
};

export default FeatureShowcase;
