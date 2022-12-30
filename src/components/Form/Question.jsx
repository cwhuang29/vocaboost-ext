import React, { useReducer } from 'react';
import PropTypes from 'prop-types';

import { Autocomplete, Box, Checkbox, FormControlLabel, Stack, TextField, Typography } from '@mui/material';

const emptyState = { label: '', options: [], isReverseGrading: false, isMultipleChoice: true, maxScore: 0 };

const actionType = {
  SET_QUESTION: 'SET_QUESTION',
  SET_OPTIONS: 'SET_OPTIONS',
  SET_REVERSE_GRADING: 'SET_REVERSE_GRADING',
  SET_MULTIPLE_CHOICE: 'SET_MULTIPLE_CHOICE',
  SET_MAX_POINT: 'SET_MAX_POINT',
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionType.SET_QUESTION:
      return { ...state, label: payload };
    case actionType.SET_OPTIONS:
      return { ...state, options: payload };
    case actionType.SET_REVERSE_GRADING:
      return { ...state, isReverseGrading: payload };
    case actionType.SET_MULTIPLE_CHOICE:
      return { ...state, isMultipleChoice: payload, options: payload ? state.options : [] }; // Remove options if necessary
    case actionType.SET_MAX_POINT:
      return { ...state, maxScore: payload };
    default:
      return state;
  }
};

export const Question = props => {
  const { role, value, handleChange } = props;
  // If user is editing an existing form, the options come from database. Otherwise, the options may come from previous multiple choice question
  // eslint-disable-next-line no-nested-ternary
  const initialState = value.label ? value : value.options.length ? { ...emptyState, options: value.options } : emptyState;
  const [state, dispatch] = useReducer(reducer, initialState);

  const transferStateToParent = changedInput => handleChange({ id: value.id, ...state, ...changedInput });

  const handleReverseGradingChange = evt => {
    const payload = evt.target.checked;
    dispatch({ type: actionType.SET_REVERSE_GRADING, payload });
    transferStateToParent({ isReverseGrading: payload });
  };

  const handleIsMultipleChoice = evt => {
    const payload = evt.target.checked;
    dispatch({ type: actionType.SET_MULTIPLE_CHOICE, payload });

    let obj = { isMultipleChoice: payload };
    if (!payload) {
      obj = { ...obj, options: [] }; // Remove options if the question is not a multiple choice anymore
    }
    transferStateToParent(obj);
  };

  // An onChange event on an input of type number will give you the string corresponding to the entered number. That is a browser behaviour
  const handleMaxPointChange = evt => {
    const maxScore = parseInt(evt.target.value, 10);
    dispatch({ type: actionType.SET_MAX_POINT, payload: maxScore });
    transferStateToParent({ maxScore });
  };

  const handleQuestionChange = evt => {
    const label = evt.target.value;
    dispatch({ type: actionType.SET_QUESTION, payload: label });
    transferStateToParent({ label });
  };

  const handleOptionsChange = (evt, newValue) => {
    const options = newValue; // Array type since component's prop multiple={true}
    dispatch({ type: actionType.SET_OPTIONS, payload: options });
    transferStateToParent({ options });
  };

  return (
    <Stack spacing={1} sx={{ textAlign: 'center', marginBottom: '15px' }}>
      <Typography variant='h6' component='div' sx={{ textAlign: 'left' }}>
        問題{value.id + 1}
      </Typography>

      <Box style={{ display: 'flex' }}>
        <FormControlLabel control={<Checkbox checked={state.isReverseGrading} onChange={handleReverseGradingChange} />} label='是否為反向計分' />

        <TextField
          name={`${role}-${value.id}-max-point`}
          label='反向計分之總分'
          type='number'
          disabled={state.isReverseGrading === false}
          value={state.maxScore}
          onChange={handleMaxPointChange}
          size='small'
        />
      </Box>

      <TextField fullWidth name={`${role}-${value.id}-question`} label='Question' value={state.label} onChange={handleQuestionChange} />

      <FormControlLabel control={<Checkbox checked={state.isMultipleChoice} onChange={handleIsMultipleChoice} />} label='選擇題' style={{ marginLeft: -11 }} />
      {state.isMultipleChoice && (
        <Autocomplete
          multiple
          freeSolo
          selectOnFocus
          handleHomeEndKeys
          clearOnBlur
          options={[]}
          defaultValue={state.options}
          renderOption={(_props, option) => <li {..._props}>{option}</li>}
          renderInput={params => <TextField {...params} label='Options' name={`${role}-${value.id}-option`} value={state.options} />}
          onChange={handleOptionsChange}
        />
      )}
    </Stack>
  );
};

Question.propTypes = {
  role: PropTypes.string.isRequired,
  value: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

Question.defaultProps = {
  value: {},
};
