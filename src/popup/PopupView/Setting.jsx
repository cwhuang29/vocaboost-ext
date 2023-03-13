import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';

import { LANGS_DISPLAY } from '@constants/i18n';
import { HIGHLIGHTER_FONT_SIZE, LANGS } from '@constants/index';
import { toCapitalize } from '@utils/stringHelpers';

import { popupSettingActionType } from './action';

const Setting = ({ language: cfgLang, fontSize: cfgFontSize, showDetail: cfgShowDetail, handleChange }) => {
  const [language, setLanguage] = useState(cfgLang); // The key of LANGS_DISPLAY
  const [fontSize, setFontSize] = useState(cfgFontSize);
  const [showDetail, setShowDetail] = useState(cfgShowDetail);

  /*
   * You can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn’t be expensive
   * An update during rendering is exactly what getDerivedStateFromProps has always been like conceptually.
   * In essence, we can optimize performance by getting rid of an additional browser repaint phase, as useEffect always runs after the render is committed to the screen
   * https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
   * https://stackoverflow.com/questions/54625831/how-to-sync-props-to-state-using-react-hooks-setstate
   */
  if (cfgLang !== language) setLanguage(cfgLang);
  if (cfgFontSize !== fontSize) setFontSize(cfgFontSize);
  if (cfgShowDetail !== showDetail) setShowDetail(cfgShowDetail);
  // useEffect(() => { setLanguage(cfgLang); }, [cfgLang]); // Don't do this (cause another rerender)

  const languageOnChange = evt => {
    const payload = evt.target.value;
    setLanguage(payload);
    handleChange({ type: popupSettingActionType.CHANGE_LANGUAGE, payload });
  };

  const fontSizeOnChange = evt => {
    const payload = evt.target.value;
    setFontSize(payload);
    handleChange({ type: popupSettingActionType.CHANGE_FONT_SIZE, payload });
  };

  const showDetailOnChange = evt => {
    const payload = evt.target.checked;
    setShowDetail(payload);
    handleChange({ type: popupSettingActionType.CHANGE_SHOW_DETAIL, payload });
  };

  const textFieldStyles = { width: '46%' };
  const textInputProps = { fontSize: '0.96rem' };
  const menuItemStyles = { fontSize: '0.92rem' };

  return (
    <Box>
      <Box style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px 0' }}>
        <TextField
          select
          name='language'
          label='Language'
          size='small'
          value={language}
          onChange={languageOnChange}
          style={textFieldStyles}
          InputLabelProps={{ style: textInputProps }}
          InputProps={{ style: textInputProps }}
        >
          {Object.keys(LANGS).map(lang => (
            <MenuItem key={lang} value={lang} style={menuItemStyles}>
              {LANGS_DISPLAY[lang]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          name='fontSize'
          label='Font size'
          size='small'
          value={fontSize}
          onChange={fontSizeOnChange}
          style={textFieldStyles}
          InputLabelProps={{ style: textInputProps }}
          InputProps={{ style: textInputProps }}
        >
          {Object.values(HIGHLIGHTER_FONT_SIZE).map(size => (
            <MenuItem key={size} value={size} style={menuItemStyles}>
              {toCapitalize(size)}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <FormControlLabel
        control={<Checkbox checked={showDetail} onChange={showDetailOnChange} />}
        label={<span style={{ fontSize: '15px' }}>Show definitions and examples on hover</span>}
      />
    </Box>
  );
};

Setting.propTypes = {
  language: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  showDetail: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Setting;
