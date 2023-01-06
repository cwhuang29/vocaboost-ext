import React from 'react';
import PropTypes from 'prop-types';
import { FormHelperText } from '@mui/material';

const SectionTitle = ({ children }) => <FormHelperText style={{ margin: '-2px 0 12px 0', lineHeight: '10px' }}>{children}</FormHelperText>;

SectionTitle.propTypes = {
  children: PropTypes.string.isRequired,
};

export default SectionTitle;
