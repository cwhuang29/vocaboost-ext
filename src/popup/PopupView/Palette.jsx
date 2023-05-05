import React from 'react';
import PropTypes from 'prop-types';

import { Box, Skeleton } from '@mui/material';

import { HIGHLIGHTER_BG_COLORS_CODE } from '@constants/styles';

import { popupSettingActionType } from './action';

const Palette = ({ color: cfgColor, handleChange }) => {
  const size = 35;
  const baseStyle = { cursor: 'pointer' };
  const selectedStyle = { border: '2.7px solid rgb(93 93 93)', filter: 'saturate(2.8)' };

  const onClick = color => () => {
    handleChange({ type: popupSettingActionType.CHANGE_HIGHLIGHT_COLOR, payload: color });
  };

  return (
    <Box style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '10px 0 -5px' }}>
      {Object.entries(HIGHLIGHTER_BG_COLORS_CODE).map(([colorName, colorCode]) => (
        <Skeleton
          variant='circular'
          animation='wave'
          width={size}
          height={size}
          key={colorName}
          style={{ ...baseStyle, ...(cfgColor === colorName ? selectedStyle : {}), backgroundColor: colorCode }}
          onClick={onClick(colorName)}
        />
      ))}
    </Box>
  );
};

Palette.propTypes = {
  color: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Palette;
