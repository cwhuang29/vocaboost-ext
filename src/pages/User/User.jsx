import React from 'react';
import PropTypes from 'prop-types';

import { getFormsByUser } from '@actions/form';
import CardWithImage from '@components/CardWithImage';
import useAuth from '@hooks/useAuth';
import withFetchService from '@shared/hooks/withFetchService';
import { getDisplayTime } from '@shared/utils/time';

import { Typography } from '@mui/material';

const transformTodoForms = data =>
  data.map(d => ({
    title: d.name,
    redirectTo: `/forms/answer/${d.id}`,
    assignedAt: getDisplayTime(new Date(d.assignedAt)),
    img: '/assets/persona/student.jpeg',
  }));

const UserView = props => {
  const { data, error, isLoading } = props;
  const { user } = useAuth();
  const { data: formData = {} } = data;

  return (
    !isLoading &&
    Object.keys(error).length === 0 && (
      <>
        <Typography variant='h2' component='div' sx={{ fontWeight: 'bold', marginTop: '0.8em' }}>
          {`${user.lastName}${user.firstName}`}您好
        </Typography>
        <Typography variant='h5' component='div' sx={{ margin: '0.35em 0 1.2em 0' }}>
          您還有<span style={{ color: 'red', padding: '0 7px' }}>{formData.length}</span>個問卷待填寫
        </Typography>
        <CardWithImage data={transformTodoForms(formData)} isLoading={isLoading} />
      </>
    )
  );
};

const getFormByUserForComponent = () => getFormsByUser();

const User = withFetchService(UserView, getFormByUserForComponent);

UserView.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default User;
