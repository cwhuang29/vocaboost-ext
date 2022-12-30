import React from 'react';
import PropTypes from 'prop-types';

import DataGrid from '@components/DataGrid';
import PageWrapper from '@components/HomePageWrapper';
import { GLOBAL_MESSAGE_SERVERITY } from '@shared/constants/styles';
import withFetchService from '@shared/hooks/withFetchService';
import userService from '@shared/services/user.service';
import { getDisplayTime } from '@shared/utils/time';

import { Alert, Typography } from '@mui/material';

const columns = [
  {
    field: 'name',
    headerName: '姓名',
    flex: 0.7,
    minWidth: 70,
  },
  {
    field: 'email',
    headerName: '信箱',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'fillOutCount',
    headerName: '填寫問卷數量',
    flex: 0.7,
    minWidth: 30,
  },
  {
    field: 'fillOutNames',
    headerName: '填寫問卷名稱 (完成時間)',
    flex: 2,
    minWidth: 100,
    align: 'left',
    valueFormatter: ({ value }) => value?.join(', ') || '',
    renderCell: params => (
      <div>
        {params.value?.map(p => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'assignedCount',
    headerName: '分派問卷數量',
    flex: 0.7,
    minWidth: 30,
  },
  {
    field: 'assignedNames',
    headerName: '分派問卷名稱 (分派時間)',
    flex: 2,
    minWidth: 100,
    align: 'left',
    valueFormatter: ({ value }) => value?.join(', ') || '',
    renderCell: params => (
      <div>
        {params.value?.map(p => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'createdAt',
    headerName: '創立帳號時間',
    flex: 1,
    minWidth: 70,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
    // renderCell: (params) => <span style={{ color: new Date(params.value) > new Date() ? '#FF5550' : '' }}>{getDisplayTime(new Date(params.value))}</span>,
  },
];

const SpacingComponent = () => <div style={{ marginBottom: '2.8em' }} />;

const getUserOverview = () => userService.getAllUsers();

const getRowId = row => `${row.email}`;

const UserOverViewView = props => {
  const { data, error, isLoading } = props;
  const { data: userData = [] } = data;

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 /* && !isLoading */ && (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', margin: ' 0.3em 0 0.8em' }}>
            使用者一覽
          </Typography>

          <Alert severity={GLOBAL_MESSAGE_SERVERITY.WARNING}>
            <div style={{ fontSize: '1rem' }}>僅有已註冊的用戶才會顯示</div>
          </Alert>
          <SpacingComponent />

          <DataGrid autoHeight isLoading={isLoading} columns={columns} rows={userData} getRowId={getRowId} />
          <SpacingComponent />
        </>
      )}
    </PageWrapper>
  );
};

const UserOverview = React.memo(() => {
  const UserOverviewWithData = withFetchService(UserOverViewView, getUserOverview, false);
  return <UserOverviewWithData />;
});

UserOverViewView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default UserOverview;
