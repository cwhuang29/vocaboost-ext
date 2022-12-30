import React from 'react';
import PropTypes from 'prop-types';

import { popupSettingActionType } from '@popup/helpers/action';
import { HIGHLIGHTER_BG_COLORS_CODE } from '@shared/constants/styles';

import { Box, Skeleton } from '@mui/material';

const Palette = ({ color: cfgColor, handleChange }) => {
  const size = 36;
  const baseStyle = { cursor: 'pointer' };
  const selectedStyle = { border: '2.7px solid rgb(93 93 93)', filter: 'saturate(2.8)' };

  const onClick = color => () => {
    handleChange({ type: popupSettingActionType.CHANGE_HIGHLIGHT_COLOR, payload: color });
  };

  return (
    <Box>
      <Box style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
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
    </Box>
  );
};

Palette.propTypes = {
  color: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Palette;
