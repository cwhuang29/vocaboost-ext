import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { SubmitAndCancelButtonGroup } from '@components/Button';
import FormResultModal from '@components/Form/FormResultModal';
import PageWrapper from '@components/HomePageWrapper';
import { validateMsg } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import formService from '@shared/services/form.service';

import { Alert, Box, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography } from '@mui/material';

import { roleProfiles } from './createFormData';

const validationSchema = Yup.object({
  // answers: Yup.array().of(Yup.number('Should be number type').required(validateMsg.REQUIRED)).strict().required(),
  answers: Yup.array().of(Yup.string().required(validateMsg.REQUIRED)).strict().required(),
});

const FormAnswer = props => {
  const { formId } = useParams();
  const { formData } = props;
  const navigate = useNavigate();
  const { addGlobalMessage } = useGlobalMessageContext();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenFormModal] = useState(false);
  const [score, setScore] = useState();

  // eslint-disable-next-line no-unused-vars
  const { minScore, optionsCount, formTitle: title, formIntro: intro, questions = [] } = formData;
  let role = null;
  roleProfiles.forEach(r => {
    role = title[r.label] !== '' ? r.label : role;
  });

  // eslint-disable-next-line no-unused-vars
  const getOptionScore = (idx, isReverseGrading, maxScore) => (isReverseGrading ? maxScore - (minScore + idx) : minScore + idx);

  const submitButtonText = '確認送出';
  const optionStyle = { marginRight: '60px' };

  const formik = useFormik({
    initialValues: {
      answers: [...Array(questions[role]?.length || 0)],
    },
    validationSchema,
    // validate: (values) => console.log(JSON.stringify(values, null, 2)),
    onSubmit: async values => {
      await formService
        .sendFormAnswer(formId, values)
        .then(resp => {
          setScore(resp.data);
          setOpenFormModal(true);
        })
        .catch(err => {
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
          });
        })
        .finally(() => setLoading(false));
    },
  });

  const onCancel = () => navigate(-1);

  const onSubmit = () => {
    setLoading(true);
    formik.submitForm();
    setLoading(false); // In case the validate doesn't pass
  };

  return (
    <PageWrapper>
      {!questions[role] ? (
        <Alert severity='error' style={{ fontWeight: 600 }}>
          此份量表沒有提供任何問題，若有疑問請洽管理員。
        </Alert>
      ) : (
        <Box
          component='form'
          onSubmit={formik.handleSubmit} // Alternative: execute formik.handleSubmit() manually in the onClick callback function
        >
          <FormResultModal open={openModal} score={score} />

          <Typography variant='h3' component='div' sx={{ fontWeight: '600', marginBottom: '20px' }}>
            {title[role]}
          </Typography>
          <Typography variant='h6' component='div' sx={{ fontWeight: '500', marginBottom: '20px' }}>
            {intro[role]}
          </Typography>
          {questions[role].map(question => (
            <React.Fragment key={question.id}>
              <Typography variant='h5' component='div' sx={{ fontWeight: '500', textAlign: 'left', margin: '55px 0 20px' }}>
                <span style={{ padding: '0 20px 0 0' }}>{question.id + 1}.</span>
                {question.label}
              </Typography>

              {!question.isMultipleChoice && (
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  name={`answers[${question.id}]`} // Without this attr: Formik called `handleChange`, but you forgot to pass an `id` or `name` attribute to your input
                  label={`question-${question.id + 1}`} // The text displayed
                  value={formik.values.answers[question.id] || ''} // If assigning undefined as default value: A component is changing an uncontrolled input to be controlled
                  onChange={formik.handleChange}
                  error={formik.touched.answers && formik.errors.answers && Boolean(formik.touched.answers[question.id] && formik.errors.answers[question.id])}
                  helperText={formik.errors.answers && formik.errors.answers[question.id]}
                />
              )}

              {question.isMultipleChoice && (
                <FormControl fullWidth>
                  {/* <FormLabel>This is label</FormLabel> */}
                  <RadioGroup
                    row
                    aria-labelledby={`question-${question.id + 1}`}
                    onChange={(evt, val) => {
                      formik.setFieldValue(`answers[${question.id}]`, val);
                    }}
                    style={{ justifyContent: 'space-between' }}
                  >
                    {question.options.map((option, idx) => (
                      <FormControlLabel
                        key={`${option}`}
                        value={idx} // Just record the index of the options and calculate scores in backend
                        control={<Radio />}
                        label={option}
                        style={optionStyle}
                      />
                    ))}
                    {/* Formik sets touched flags on blur event instead of on change. In the very beginning, formik.touched and formik.errors equal to {} */}
                    {formik.touched.answers && formik.errors.answers && (
                      <FormHelperText error={Boolean(formik.touched.answers[question.id] && formik.errors.answers[question.id])} style={{ marginLeft: 0 }}>
                        {formik.errors.answers[question.id]}
                      </FormHelperText>
                    )}
                  </RadioGroup>
                </FormControl>
              )}
            </React.Fragment>
          ))}

          <div style={{ padding: '50px 0' }} />
          <SubmitAndCancelButtonGroup disabledSubmit={loading} onSubmit={onSubmit} onCancel={onCancel} submitButtonText={submitButtonText} />
        </Box>
      )}
    </PageWrapper>
  );
};

FormAnswer.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default FormAnswer;
