import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { SubmitAndCancelButtonGroup } from '@components/Button';
import msg, { validateMsg } from '@constants/messages';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { Autocomplete, Box, ListSubheader, Modal as MuiModal, Stack, TextField } from '@mui/material';

const initialValues = {
  email: [],
  subject: '',
  content: '',
  footer: '',
};

const validationSchema = Yup.object({
  email: Yup.array().of(Yup.string().email(validateMsg.AUTH.EMAIL_REQUIRED).max(100, validateMsg.TOO_LONG)).min(1, validateMsg.REQUIRED),
  subject: Yup.string().required(validateMsg.REQUIRED),
  content: Yup.string().required(validateMsg.REQUIRED),
  footer: Yup.string(),
});

const EmailNotificationModal = props => {
  const { open, onClose, onSubmit, submitButtonText, cancelButtonText, isFetchingEmail, emailList } = props;
  const [loading, setLoading] = useState(false);
  const { addGlobalMessage } = useGlobalMessageContext();
  const cancelButtonOnClick = () => onClose();

  const formik = useFormik({
    initialValues,
    validationSchema,
    // validate: (values) => console.log(JSON.stringify(values, null, 2)),
    onSubmit: async values => {
      setLoading(true);
      addGlobalMessage({
        title: msg.REQUEST_IS_HANDLING,
        severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
        timestamp: Date.now(),
      });
      await onSubmit(values)
        .then(resp => {
          addGlobalMessage({
            title: resp.title,
            content: resp.content,
            severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
            timestamp: Date.now(),
          });
          onClose();
        })
        .catch(err => {
          addGlobalMessage({
            title: err.title,
            content: err.content,
            severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
            timestamp: Date.now(),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  const submitButtonOnClick = () => {
    setLoading(true);
    formik.handleSubmit(); // Run valdidate() then onSubmit()
    setLoading(false); // In case the validate doesn't pass
  };

  return (
    open && (
      <MuiModal open={open} /* onClose={onClose} */ aria-labelledby='modal-title' aria-describedby='modal-description'>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#EDEDED',
            border: 'none',
            borderRadius: '12px',
            boxShadow: 25,
            p: 3,
          }}
          style={{
            width: 'min(800px, 85%)',
            height: 'min(1000px, 86%)',
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            選擇收信者（註：括號中的身份是先前指派量表給該使用者時選擇的身份）
          </ListSubheader>

          <Stack spacing={2}>
            <Autocomplete
              multiple
              selectOnFocus
              filterSelectedOptions
              handleHomeEndKeys
              loading={isFetchingEmail} // This shows the loadingText in place of suggestions (only if there are no suggestions to show, e.g. options are empty)
              loadingText='Retrieving email list ...'
              options={emailList}
              defaultValue={formik.values.email}
              renderOption={(_props, option) => <li {..._props}>{`${option.writerEmail} (${option.role})`}</li>}
              onChange={(e, value) => {
                // Since this Autocomplete only accesses inputs from options list, the element in the give array is the same as those in input data
                // However, after reopening modal, the old data provied by defaultValue will be array of string
                const revisedValue = value.map(v => (v.constructor === Object ? v.writerEmail : v));
                formik.setFieldValue('email', revisedValue);
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label='請輸入email'
                  autoFocus
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              )}
              getOptionLabel={option => {
                if (typeof option === 'string') {
                  return option;
                }
                return option.writerEmail;
              }}
            />
          </Stack>

          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            信件內容
          </ListSubheader>

          <Stack spacing={2}>
            <TextField
              fullWidth
              name='subject'
              label='Email Subject'
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              name='content'
              label='Email Content'
              value={formik.values.content}
              onChange={formik.handleChange}
              error={formik.touched.content && Boolean(formik.errors.content)}
              helperText={formik.touched.content && formik.errors.content}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              name='footer'
              label='Email Footer'
              value={formik.values.footer}
              onChange={formik.handleChange}
              error={formik.touched.footer && Boolean(formik.errors.footer)}
              helperText={formik.touched.footer && formik.errors.footer}
            />
          </Stack>

          <SubmitAndCancelButtonGroup
            disabledSubmit={loading}
            onSubmit={submitButtonOnClick}
            onCancel={cancelButtonOnClick}
            submitButtonText={submitButtonText}
            cancelButtonText={cancelButtonText}
          />
        </Box>
      </MuiModal>
    )
  );
};

EmailNotificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
  isFetchingEmail: PropTypes.bool,
  emailList: PropTypes.array.isRequired,
};

EmailNotificationModal.defaultProps = {
  cancelButtonText: '關閉',
  isFetchingEmail: false,
};

export default EmailNotificationModal;
