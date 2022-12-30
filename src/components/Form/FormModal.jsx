import React from 'react';
import PropTypes from 'prop-types';

import { SubmitAndCancelButtonGroup } from '@components/Button';
import { questionsEmptyState, roleProfiles } from '@pages/Form/createFormData';

import { Box, ListItemButton, ListItemText, ListSubheader, Modal as MuiModal, Typography } from '@mui/material';

const fieldName = {
  researchName: '研究名稱',
  formName: '量表名稱',
  formCustId: '量表代號',
  minScore: '每題選項之最低分',
  optionsCount: '每題的選項數量',
};

const FormDataItem = ({ field, value }) => (
  <ListItemButton style={{ display: 'flex', paddingLeft: '8px' }}>
    <ListItemText
      primary={
        <Typography type='subtitle2' style={{ fontWeight: 'bold' }}>
          {field}
        </Typography>
      }
      style={{ width: '25%', fontWeight: 'bold' }}
    />
    <ListItemText primary={value} style={{ width: '75%', textAlign: 'left' }} />
  </ListItemButton>
);
// <Typography variant='subtitle1' style={{}}>
//   <span style={{ fontWeight: 'bold' }}>{field}: </span>{value}
// </Typography>

const FormModal = props => {
  const { open, onClose, onSubmit, submitButtonText, cancelButtonText, formData } = props;
  const { researchName, formName, formCustId, minScore, optionsCount, formTitle, formIntro, questions } = formData || {};
  const onCancel = () => onClose();

  return (
    open && (
      <MuiModal open={open} onClose={onClose} aria-labelledby='modal-title' aria-describedby='modal-description'>
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
            width: 'min(1000px, 86%)',
            height: 'min(1500px, 90%)',
            overflowY: 'auto',
            maxWidth: '86%',
          }}
        >
          <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
            量表資料
          </ListSubheader>
          <FormDataItem field={fieldName.researchName} value={researchName.join(', ')} />
          <FormDataItem field={fieldName.formName} value={formName} />
          <FormDataItem field={fieldName.formCustId} value={formCustId} />
          <FormDataItem field={fieldName.minScore} value={minScore} />
          <FormDataItem field={fieldName.optionsCount} value={optionsCount} />

          {roleProfiles.map(role => (
            <React.Fragment key={role.id}>
              <ListSubheader component='div' disableSticky style={{ backgroundColor: 'inherit' }}>
                給{role.display}的問題
              </ListSubheader>
              {questions[role.label].length > 0 && <FormDataItem field={`給${role.display}看的量表名稱`} value={formTitle[role.label]} />}
              {questions[role.label].length > 0 && <FormDataItem field={`給${role.display}看的量表名稱`} value={formIntro[role.label]} />}
              {questions[role.label].map((question, idx) => (
                <React.Fragment key={question.label}>
                  <FormDataItem field={`題目${idx + 1}`} value={question.label} />
                  {question.isMultipleChoice && <FormDataItem field='選項' value={question.options.join(', ')} />}
                  <FormDataItem field='是否為反向計分' value={question.isReverseGrading ? '是' : '否'} />
                  {question.isReverseGrading && <FormDataItem field='總分（若為反向計分）' value={question.maxScore} />}
                  <hr />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

          <br />
          <br />
          <SubmitAndCancelButtonGroup onSubmit={onSubmit} onCancel={onCancel} submitButtonText={submitButtonText} cancelButtonText={cancelButtonText} />
        </Box>
      </MuiModal>
    )
  );
};

FormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
  formData: PropTypes.object,
};

FormModal.defaultProps = {
  cancelButtonText: '關閉',
  formData: questionsEmptyState,
};

FormDataItem.propTypes = {
  field: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default FormModal;
