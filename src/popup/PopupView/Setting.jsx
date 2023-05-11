import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Checkbox as MuiCheckBox, FormControlLabel, MenuItem, TextField } from '@mui/material';

import { LANGS_DISPLAY, LANGS_SUPPORTED } from '@constants/i18n';
import { HIGHLIGHTER_FONT_SIZE } from '@constants/index';
import { toCapitalize } from '@utils/stringHelpers';

import { popupSettingActionType } from './action';

const Dropdown = ({ value, onChange, options, displayFunc, name, label }) => {
  const textFieldStyles = { width: '46%' };
  const textInputProps = { fontSize: '0.96rem', fontFamily: 'Cera' };
  const menuItemStyles = { fontSize: '0.92rem', fontFamily: 'Cera' };
  return (
    <TextField
      select
      size='small'
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      style={textFieldStyles}
      InputLabelProps={{ style: textInputProps }}
      InputProps={{ style: textInputProps }}
    >
      {Object.values(options).map(opt => (
        <MenuItem key={opt} value={opt} style={menuItemStyles}>
          {displayFunc(opt)}
        </MenuItem>
      ))}
    </TextField>
  );
};

const Checkbox = ({ checked, onChange, text }) => (
  <FormControlLabel
    control={<MuiCheckBox checked={checked} onChange={onChange} />}
    label={<span style={{ fontSize: '15px', fontFamily: 'Cera' }}>{text}</span>}
    style={{ margin: '0 -8px -12px' }}
  />
);

const Setting = ({ language: cfgLang, fontSize: cfgFontSize, showDetail: cfgShowDetail, suspendedPages: cfgSuspendedPages, urlInfo, handleChange }) => {
  const [language, setLanguage] = useState(cfgLang);
  const [fontSize, setFontSize] = useState(cfgFontSize);
  const [showDetail, setShowDetail] = useState(cfgShowDetail);
  const [suspendedPages, setSuspendedPages] = useState(cfgSuspendedPages);

  /*
   * You can update the state right during rendering. React will re-run the component with updated state immediately after exiting the first render so it wouldn’t be expensive
   * An update during rendering is exactly what getDerivedStateFromProps has always been like conceptually.
   * In essence, we can optimize performance by getting rid of an additional browser repaint phase, as useEffect always runs after the render is committed to the screen
   * Don't do this (cause another rerender): useEffect(() => { setLanguage(cfgLang); }, [cfgLang]);
   * https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
   * https://stackoverflow.com/questions/54625831/how-to-sync-props-to-state-using-react-hooks-setstate
   */
  if (cfgLang !== language) setLanguage(cfgLang);
  if (cfgFontSize !== fontSize) setFontSize(cfgFontSize);
  if (cfgShowDetail !== showDetail) setShowDetail(cfgShowDetail);
  if (cfgSuspendedPages.length !== suspendedPages.length) setSuspendedPages(cfgSuspendedPages); // TODO this logic is not comprehensive

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

  const suspendedOnPagesOnChange = evt => {
    const { checked } = evt.target;
    const type = checked ? popupSettingActionType.ADD_SUSPENDED_PAGES : popupSettingActionType.DEL_SUSPENDED_PAGES;
    if (checked) {
      setSuspendedPages(prev => [...prev, urlInfo]);
    } else {
      setSuspendedPages(prev => prev.filter(p => p !== urlInfo));
    }
    handleChange({ type, payload: urlInfo });
  };

  const isSuspended = suspendedPages.includes(urlInfo);

  return (
    <Box>
      <Box style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px 0' }}>
        <Dropdown name='lang' label='Language' value={language} onChange={languageOnChange} options={LANGS_SUPPORTED} displayFunc={l => LANGS_DISPLAY[l]} />
        <Dropdown name='fs' label='Font size' value={fontSize} onChange={fontSizeOnChange} options={HIGHLIGHTER_FONT_SIZE} displayFunc={s => toCapitalize(s)} />
      </Box>
      <Checkbox checked={showDetail} onChange={showDetailOnChange} text='Show definitions and examples on hover' />
      <Checkbox checked={isSuspended} onChange={suspendedOnPagesOnChange} text={`Disable on this page (${urlInfo})`} />
    </Box>
  );
};

Dropdown.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  displayFunc: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

Checkbox.defaultProps = {
  checked: false,
};

Setting.propTypes = {
  language: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  showDetail: PropTypes.bool.isRequired,
  suspendedPages: PropTypes.array.isRequired,
  urlInfo: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default Setting;
