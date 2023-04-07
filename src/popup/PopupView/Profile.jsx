import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GoogleIcon from '@mui/icons-material/Google';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { Box, Button, Typography } from '@mui/material';

import { getAuthToken } from '@browsers/identity';
import { setStorage } from '@browsers/storage';
import { EXT_STORAGE_AUTH_TOKEN, EXT_STORAGE_USER } from '@constants/storage';
import { getGoogleUserInfo } from '@oauth/google';
import authService from '@services/auth.service';
import { transformGoogleLoginResp } from '@utils/loginFormatter';

import SectionTitle from './SectionTitle';

const Profile = ({ numCollectedWords }) => {
  const [userInfo, setUserInfo] = useState({});

  const onSignIn = async () => {
    const { token, scopes } = await getAuthToken();
    const uInfo = await getGoogleUserInfo({ token });

    const { token: accessToken, user } = await authService.login(transformGoogleLoginResp({ ...uInfo, scopes })).catch(err => {
      logger(`Login error: ${JSON.stringify(err)}`); // TODO Popup error message
    });
    await Promise.all([
      setStorage({ type: 'local', key: EXT_STORAGE_AUTH_TOKEN, value: accessToken }),
      setStorage({ type: 'local', key: EXT_STORAGE_USER, value: user }),
    ]);
    setUserInfo(user);
  };

  const onSignOut = async () => {
    setUserInfo({});
  };

  const isSignedIn = Object.keys(userInfo).length === 0;

  return (
    <Box>
      {isSignedIn ? (
        <>
          <SectionTitle>Profile (sign in to keep your collected words safely)</SectionTitle>
          <Button variant='outlined' onClick={onSignIn} startIcon={<GoogleIcon />} style={{ fontSize: '98%', margin: '4px 0 -3px' }}>
            Sign in with Google
          </Button>
        </>
      ) : (
        <>
          <SectionTitle>
            Hello&nbsp;{userInfo.firstName}&nbsp;
            <SentimentSatisfiedAltIcon style={{ marginBottom: '-4.5px', fontSize: '18px' }} />
          </SectionTitle>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='body1' component='div' style={{}}>
              You have collected
              <span style={{ fontWeight: 'bold' }}>&nbsp;{numCollectedWords}&nbsp;</span>
              words!
            </Typography>
            <Button variant='outlined' size='small' onClick={onSignOut} startIcon={<GoogleIcon />} style={{ fontSize: '90%' }}>
              Sign out
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

Profile.propTypes = {
  numCollectedWords: PropTypes.number,
};

Profile.defaultProps = {
  numCollectedWords: 0,
};

export default Profile;
