import React from 'react';
import PropTypes from 'prop-types';

import { FormHelperText } from '@mui/material';

const SectionTitle = ({ children }) => <FormHelperText style={{ margin: '-3px 0 14px 0', lineHeight: '7px', fontFamily: 'Cera' }}>{children}</FormHelperText>;

SectionTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default SectionTitle;
