import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GoogleIcon from '@mui/icons-material/Google';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { Box, Button, Typography } from '@mui/material';

import { getAuthToken } from '@browsers/identity';
import { getGoogleUserInfo } from '@oauth/google';
import authService from '@services/auth.service';
import { clearAuthDataFromStorage, getUserInfoFromStorage, storeAuthDataToStorage } from '@utils/auth';
import { getLatestConfigFromServerOnLogin } from '@utils/config';
import { logger } from '@utils/logger';
import { transformGoogleLoginResp } from '@utils/loginFormatter';

import { popupSettingActionType } from './action';
import SectionTitle from './SectionTitle';

const Profile = ({ numCollectedWords, handleChange }) => {
  const [userInfo, setUserInfo] = useState({});

  const forcePopupRedraw = config => {
    handleChange({
      type: popupSettingActionType.OVERRIDE_ALL,
      payload: config,
    });
  };

  useEffect(() => {
    const setup = async () => {
      const uInfo = await getUserInfoFromStorage();
      if (uInfo) {
        setUserInfo(uInfo);
      }
    };
    setup();
  }, []);

  const onSignIn = async () => {
    const { token, scopes } = await getAuthToken();
    const uInfo = await getGoogleUserInfo({ token });
    const {
      token: accessToken,
      isNewUser,
      user,
    } = await authService.login(transformGoogleLoginResp({ ...uInfo, scopes })).catch(err => {
      logger(`Login error: ${JSON.stringify(err)}`); // TODO Popup error message
    });
    await storeAuthDataToStorage({ token: accessToken, user });
    if (!isNewUser) {
      const { latestConfig } = await getLatestConfigFromServerOnLogin();
      forcePopupRedraw(latestConfig);
    }
    setUserInfo(user);
  };

  const onSignOut = async () => {
    await authService.logout().catch(() => {}); // For logout, just ignore error message
    await clearAuthDataFromStorage();
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
  handleChange: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  numCollectedWords: 0,
};

export default Profile;
