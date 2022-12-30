import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormById } from '@actions/form';
import DataGrid from '@components/DataGrid';
import FormModal from '@components/Form/FormModal';
import PageWrapper from '@components/HomePageWrapper';
import { AssignmentModal, EmailNotificationModal } from '@components/Modal';
import StyledBadge from '@components/styledComponents/StyledBadge';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import formService from '@services/form.service';
import notificationService from '@services/notification.service';
import withFetchService from '@shared/hooks/withFetchService';

import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MailIcon from '@mui/icons-material/Mail';
import { Box, IconButton, Typography } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

import {
  formResultBaseColumns,
  formStatusBaseColumns,
  getFormResultRowId,
  getFormStatusRowId,
  transformFormResultColumns,
  transformFormResultData,
} from './formOverviewData';

const iconButtonStyle = { marginTop: '-5px' };

const muiIconStyle = { fontSize: '35px', color: '#656565' };

const getFormByIdForComponent = formId => () => getFormById(formId);

const getURLQueryFormId = () => window.location.pathname.split('/').pop(); // e.g. http://127.0.0.1/form/5

const FormModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={iconButtonStyle} onClick={onClick}>
    <StyledBadge badgeContent='' color='primary' variant='dot'>
      <InsertDriveFileIcon style={muiIconStyle} />
    </StyledBadge>
  </IconButton>
);

const AssignmentModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={iconButtonStyle} onClick={onClick}>
    <AssignmentIcon style={muiIconStyle} />
  </IconButton>
);

const NotificationModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={iconButtonStyle} onClick={onClick}>
    <MailIcon style={muiIconStyle} />
  </IconButton>
);

const FormActionItem = ({ title, Icon }) => (
  <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em', textAlign: 'left' }}>
    {title}&nbsp;{Icon}
  </Typography>
);

const Title = ({ children }) => (
  <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em', textAlign: 'left' }}>
    {children}
  </Typography>
);

const SpacingComponent = () => <div style={{ marginBottom: '2.8em' }} />;

const FormOverViewView = props => {
  const { data, error, isLoading } = props;
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isFetchingFormAssignStatusData, setIsFetchingFormAssignStatusData] = useState(true);
  const [formAssignStatusData, setFormAssignStatusData] = useState([]);
  const [isFetchingFormResultData, setIsFetchingFormResultData] = useState(true);
  const [formResultData, setFormResultData] = useState([]);
  const [formResultColumns, setFormResultColumns] = useState([]);
  const navigate = useNavigate();
  const { addGlobalMessage } = useGlobalMessageContext();

  const formId = getURLQueryFormId();
  const { data: formData = {} } = data;

  const formModalOnOpen = () => setOpenFormModal(true);
  const formModalOnClose = () => setOpenFormModal(false);
  const assignmentModalOnOpen = () => setOpenAssignmentModal(true);
  const assignmentModalOnClose = () => setOpenAssignmentModal(false);
  const notificationModalOnOpen = () => setOpenNotificationModal(true);
  const notificationModalOnClose = () => setOpenNotificationModal(false);

  const formOnSubmit = () => {
    navigate(`/update/form/${formId}`, { state: formData }); // The key should be 'state'
  };

  const AssignmentOnSubmit = async assignmentData => {
    const resp = await formService.createFormStatus(formId, assignmentData);
    // Update form status after the assignment took effect
    // Note: the form status and notification history won't update until emails are sent out
    setIsFetchingFormAssignStatusData(true);
    return resp;
  };

  const notificationOnSubmit = async notificationData => {
    const resp = await notificationService.sendEmailNotificaionByFormId(formId, notificationData);
    // Update form status after the notifications sent out
    setIsFetchingFormAssignStatusData(true);
    return resp;
  };

  useEffect(() => {
    if (!isFetchingFormAssignStatusData) {
      return;
    }
    setIsFetchingFormAssignStatusData(true);
    formService
      .getFormStatus(formId)
      .then(resp => setFormAssignStatusData(resp.data))
      .catch(err =>
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        })
      )
      .finally(() => setIsFetchingFormAssignStatusData(false));
  }, [isFetchingFormAssignStatusData]);

  useEffect(() => {
    setIsFetchingFormResultData(true);
    formService
      .getFormResult(formId)
      .then(resp => {
        const transformedData = transformFormResultData(resp.data);
        const transformedColumns = transformFormResultColumns(formResultBaseColumns, resp.data);
        setFormResultData(transformedData);
        setFormResultColumns(transformedColumns);
      })
      .catch(err =>
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        })
      )
      .finally(() => setIsFetchingFormResultData(false));
  }, []); // Just fetch one time

  const deleteFormStatus = params => () => {
    // Note: the index of data has been set to writerEmail by getRowId(), so the following two lines are equivalent
    const { id } = params;
    const email = params.row.writerEmail;

    formService
      .deleteFormStatus(formId, { email })
      .then(resp => {
        addGlobalMessage({
          title: resp.title,
          content: resp.content,
          severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
          timestamp: Date.now(),
        });

        const remainRows = formAssignStatusData.filter(d => d.writerEmail !== id);
        setFormAssignStatusData(remainRows); // This is the only way to update rows in datagrid
      })
      .catch(err => {
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      });
  };

  const formStatusActionColumn = useMemo(
    () => ({
      field: 'actions',
      headerName: 'Delete',
      type: 'actions',
      align: 'center',
      width: 80,
      getActions: params => [<GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={deleteFormStatus(params)} /* showInMenu */ />],
    }),
    [formAssignStatusData] // Otherwise formAssignStatusData in the deleteFormStatus() equals to its initial value, i.e. {}
  );

  const formStatusColumns = [...formStatusBaseColumns, formStatusActionColumn];

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && !isLoading ? (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', margin: ' 0.3em 0 0.8em' }}>
            量表—{formData.formName}
          </Typography>

          <FormModal open={openFormModal} onClose={formModalOnClose} formData={formData} submitButtonText='修改' onSubmit={formOnSubmit} />
          <AssignmentModal open={openAssignmentModal} onClose={assignmentModalOnClose} submitButtonText='送出' onSubmit={AssignmentOnSubmit} />
          <EmailNotificationModal
            open={openNotificationModal}
            onClose={notificationModalOnClose}
            submitButtonText='確認寄信'
            onSubmit={notificationOnSubmit}
            isFetchingEmail={isFetchingFormAssignStatusData}
            emailList={formAssignStatusData}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', cursor: 'default' }}>
            <FormActionItem title='查看量表' Icon={<FormModalIcon onClick={formModalOnOpen} />} />
            <FormActionItem title='分配量表' Icon={<AssignmentModalIcon onClick={assignmentModalOnOpen} />} />
            <FormActionItem title='寄通知信' Icon={<NotificationModalIcon onClick={notificationModalOnOpen} />} />
          </Box>

          <Title>量表填寫狀況</Title>
          <DataGrid
            height={500}
            isLoading={isFetchingFormAssignStatusData}
            columns={formStatusColumns}
            rows={formAssignStatusData}
            getRowId={getFormStatusRowId}
          />
          <SpacingComponent />

          <Title>量表回答狀況</Title>
          <DataGrid height={500} isLoading={isFetchingFormResultData} columns={formResultColumns} rows={formResultData} getRowId={getFormResultRowId} />
          <SpacingComponent />
        </>
      ) : (
        <div />
      )}
    </PageWrapper>
  );
};

const FormOverview = React.memo(() => {
  const { formId } = useParams();
  const FormOverviewWithData = withFetchService(FormOverViewView, getFormByIdForComponent(formId));
  return <FormOverviewWithData />;
});

FormModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

AssignmentModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

NotificationModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

FormActionItem.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.element.isRequired,
};

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

FormOverViewView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormOverview;
