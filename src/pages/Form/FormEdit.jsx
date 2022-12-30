import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import FormModal from '@components/Form/FormModal';
import { Question } from '@components/Form/Question';
import { RoleDivider } from '@components/Form/RoleDivider';
import PageWrapper from '@components/HomePageWrapper';
import { FORM_OPERATION_TYPE } from '@constants/form';
import msg, { validateMsg } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, createFilterOptions, MenuItem, Stack, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import styles from './index.module.css';

import { createFormActionType, formEmptyValues, getDefaultQuestionState, optionsCountList, questionsEmptyState, roleProfiles, roles } from './createFormData';

const filter = createFilterOptions();

const researchList = []; // TODO

const getNewQuestionState = roleQuestionState => {
  const numOfQuestions = roleQuestionState.length;
  const defaultQuestion = getDefaultQuestionState({ id: numOfQuestions });
  const prevQuestionOptions = numOfQuestions === 0 ? [] : roleQuestionState[numOfQuestions - 1].options;

  return { ...defaultQuestion, options: prevQuestionOptions };
};

const questionsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case createFormActionType.ADD_QUESTION:
      return {
        ...state,
        [payload.role]: [...state[payload.role], getNewQuestionState(state[payload.role])],
      };
    case createFormActionType.SET_QUESTION:
      return {
        ...state,
        [payload.role]: state[payload.role].map(question => (question.id === payload.value.id ? payload.value : question)),
      };
    case createFormActionType.REMOVE_QUESTION:
      return {
        ...state,
        [payload.role]: state[payload.role].slice(0, -1),
      };
    default:
      return state;
  }
};

const formikValidationSchema = Yup.object({
  researchName: Yup.array().min(1, validateMsg.REQUIRED),
  formName: Yup.string().required(validateMsg.REQUIRED),
  formCustId: Yup.string().required(validateMsg.REQUIRED),
  minScore: Yup.number(validateMsg.IS_NUMBER).min(0).required(validateMsg.REQUIRED),
  optionsCount: Yup.number().min(1).max(10).required(validateMsg.REQUIRED),
  formTitle: Yup.object().shape(Object.fromEntries(roles.map(role => [role, '']))),
  formIntro: Yup.object(),
  // date: Yup.date().default(() => new Date()).max(new Date(), "Are you a time traveler?!"),
  // wouldRecommend: Yup.boolean().default(false),
});

const FormEdit = props => {
  const { title, operationType, submitAction, formData } = props;
  const initialFormValues = operationType === FORM_OPERATION_TYPE.CREATE ? formEmptyValues : formData;
  const initialQuestionsValues = operationType === FORM_OPERATION_TYPE.CREATE ? questionsEmptyState : formData.questions;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addGlobalMessage, clearAllGlobalMessages } = useGlobalMessageContext();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [questionState, questionDispatch] = useReducer(questionsReducer, initialQuestionsValues);

  const formik = useFormik({
    initialValues: initialFormValues,
    validationSchema: formikValidationSchema,
    validateOnChange: false,
    validate: values => {
      let hasError = false;

      if (!loading) {
        // Ensure the 'Form is creating' message persists on the webpage
        clearAllGlobalMessages();
      }

      roleProfiles.forEach(role =>
        questionState[role.label].forEach(question => {
          if (question.label === '') {
            hasError = true;
            addGlobalMessage({
              title: 'Question should not be empty',
              content: `Role: ${role.display}. Question ID: ${question.id + 1}`,
              severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
              timestamp: Date.now(),
            });
          }
          if (question.isMultipleChoice && question.options.length !== values.optionsCount) {
            hasError = true;
            addGlobalMessage({
              title: `Number of options is not correct`,
              content: `Role: ${role.display}. Question ID: ${question.id + 1}. Number of options: ${question.options.length}`,
              severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
              timestamp: Date.now(),
            });
          }
        })
      );
      return hasError ? { questionError: '' } : {};
    },
    onSubmit: async values => {
      if (!loading) {
        return;
      }

      addGlobalMessage({
        title: msg.REQUEST_IS_HANDLING,
        severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
        timestamp: Date.now(),
        canClose: false, // In case user keep clicking submit button
      });

      const finalValue = { ...values, questions: questionState };
      await dispatch(submitAction(finalValue))
        .then(resp => {
          clearAllGlobalMessages();
          addGlobalMessage({
            title: resp.title,
            severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
            timestamp: Date.now(),
          });
          navigate('/');
        })
        .catch(err => {
          clearAllGlobalMessages();
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
            canClose: false,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
  const submitButtonOnClick = () => {
    formik.validateForm().then(formErrors => {
      if (Object.keys(formErrors).length === 0) {
        const finalValue = { ...formik.values, questions: questionState };
        setModalData(finalValue);
        setOpenModal(true);
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(finalValue, null, 2));
      }
    });
    // if (Object.keys(formik.errors).length === 0 && Object.keys(formik.touched).length !== 0) { } // This is not always the freshest data
  };

  const submitForm = () => {
    setLoading(true);
    formik.handleSubmit(); // Run valdidate() then onSubmit()
  };

  const modalOnClose = () => setOpenModal(false);

  const cancelButtonOnClick = () => navigate(-1);

  const handleChildChange =
    ({ role }) =>
    value =>
      questionDispatch({ type: createFormActionType.SET_QUESTION, payload: { role, value } });

  return (
    <PageWrapper>
      <Box component='form' onSubmit={formik.handleSubmit}>
        <FormModal open={openModal} onClose={modalOnClose} formData={modalData} submitButtonText='確認送出' onSubmit={submitForm} />
        <Typography variant='h3' component='div' sx={{ fontWeight: '600', marginBottom: '25px' }}>
          {title}
        </Typography>

        <Stack spacing={3} sx={{ textAlign: 'center' }}>
          <Autocomplete
            multiple
            freeSolo
            selectOnFocus
            filterSelectedOptions
            handleHomeEndKeys
            options={researchList}
            defaultValue={initialFormValues.researchName}
            renderOption={(_props, option) => <li {..._props}>{option.label}</li>}
            onChange={(e, value) => {
              const revisedValue = value.map(v => (v.constructor === Object ? v.label : v)); // The element in the option list are obejcts
              formik.setFieldValue('researchName', revisedValue); // Use this to replace value={formik.values.researchName}
            }}
            renderInput={params => (
              <TextField
                {...params}
                label='研究名稱'
                autoFocus
                error={formik.touched.researchName && Boolean(formik.errors.researchName)}
                helperText={formik.touched.researchName && formik.errors.researchName}
              />
            )}
            filterOptions={(options, params) => {
              const { inputValue } = params;
              const isExisting = options.some(option => inputValue === option.label);
              const filtered = filter(options, params);
              if (inputValue !== '' && !isExisting) {
                filtered.push({ inputValue, label: inputValue });
              }
              return filtered;
            }}
            getOptionLabel={option => {
              if (typeof option === 'string') {
                return option; // Value selected with enter, right from the input
              }
              if (option.inputValue) {
                return option.inputValue; // Add "xxx" option created dynamically
              }
              return option.label; // Regular option
            }}
          />

          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              name='formName'
              label='量表名稱'
              value={formik.values.formName}
              onChange={formik.handleChange}
              error={formik.touched.formName && Boolean(formik.errors.formName)}
              helperText={formik.touched.formName && formik.errors.formName}
              sx={{ width: '48%' }}
            />

            <TextField
              name='formCustId'
              label='量表代號'
              value={formik.values.formCustId}
              onChange={formik.handleChange}
              error={formik.touched.formCustId && Boolean(formik.errors.formCustId)}
              helperText={formik.touched.formCustId && formik.errors.formCustId}
              sx={{ width: '48%' }}
            />
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
            <TextField
              name='minScore'
              label='每題選項之最低分'
              type='number'
              value={formik.values.minScore}
              onChange={formik.handleChange}
              error={formik.touched.minScore && Boolean(formik.errors.minScore)}
              helperText={formik.touched.minScore && formik.errors.minScore}
              sx={{ width: '48%' }}
            />
            <TextField
              select
              name='optionsCount'
              label='每題的選項數量'
              value={formik.values.optionsCount}
              onChange={formik.handleChange}
              error={formik.touched.optionsCount && Boolean(formik.errors.optionsCount)}
              helperText={formik.touched.optionsCount && formik.errors.optionsCount}
              sx={{ width: '48%' }}
            >
              {optionsCountList.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
        <br />

        {roleProfiles.map(role => (
          <React.Fragment key={role.id}>
            <RoleDivider {...role} />
            <Stack spacing={3} sx={{ mb: '20px' }}>
              <TextField
                fullWidth
                name={`formTitle.${role.label}`}
                label={`給${role.display}看的量表名稱（沒有問題時此欄位會被忽略）`}
                value={formik.values[`formTitle[${role.label}]`]}
                defaultValue={initialFormValues.formTitle[role.label]}
                onChange={formik.handleChange}
                error={formik.touched[`formTitle[${role.label}]`] && Boolean(formik.errors[`formTitle[${role.label}]`])}
                helperText={formik.touched[`formTitle[${role.label}]`] && formik.errors[`formTitle[${role.label}]`]}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                name={`formIntro.${role.label}`}
                label={`給${role.display}看的量表說明（沒有問題時此欄位會被忽略）`}
                value={formik.values[`formIntro[${role.label}]`]}
                defaultValue={initialFormValues.formIntro[role.label]}
                onChange={formik.handleChange}
                error={formik.touched[`formIntro[${role.label}]`] && Boolean(formik.errors[`formIntro[${role.label}]`])}
                helperText={formik.touched[`formIntro[${role.label}]`] && formik.errors[`formIntro[${role.label}]`]}
              />
            </Stack>

            {questionState[role.label].map(question => (
              <Question key={question.id} role={role.label} value={question} handleChange={handleChildChange({ role: role.label })} />
            ))}

            <Box style={{ position: 'relative', textAlign: 'right', marginTop: '20px' }}>
              <Button
                disabled={questionState[role.label].length === 0}
                variant='contained'
                type='button'
                style={{ marginLeft: '20px', backgroundColor: '#ED5656' }}
                onClick={() => questionDispatch({ type: createFormActionType.REMOVE_QUESTION, payload: { role: role.label } })}
              >
                移除最後一題
              </Button>
              <Button
                variant='contained'
                type='button'
                style={{ marginLeft: '20px', backgroundColor: '#3A7CEB' }}
                onClick={() => questionDispatch({ type: createFormActionType.ADD_QUESTION, payload: { role: role.label } })}
              >
                創建新題目
              </Button>
            </Box>
          </React.Fragment>
        ))}

        <Stack spacing={2} sx={{ textAlign: 'center', mt: '30px', mb: '50px' }}>
          <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box style={{ width: '30%' }} />
            <Button
              size='large'
              variant='contained'
              style={{ marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#F95C5C' }}
              onClick={cancelButtonOnClick}
            >
              &nbsp;&nbsp;取消&nbsp;&nbsp;
            </Button>
            <LoadingButton
              size='large'
              loading={loading}
              variant='contained'
              type='submit' // Though I trigger formik.onSubmit() manually, this setting is fine since I can trigger the validate() before showing preview modal
              style={{ marginLeft: 'auto', marginRight: 'auto', backgroundColor: '#4780DD' }}
              onClick={submitButtonOnClick}
            >
              預覽結果
            </LoadingButton>
            <Box style={{ width: '30%' }} />
          </Box>
        </Stack>
      </Box>
    </PageWrapper>
  );
};

FormEdit.propTypes = {
  title: PropTypes.string.isRequired,
  operationType: PropTypes.string.isRequired,
  submitAction: PropTypes.func.isRequired,
  formData: PropTypes.object,
};

FormEdit.defaultProps = {
  formData: {},
};

export default FormEdit;
