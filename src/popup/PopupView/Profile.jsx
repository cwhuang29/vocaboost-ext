import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { Box, Button, Typography } from '@mui/material';

import { sendMessage } from '@browsers/message';
import { LOGIN_METHOD } from '@constants/loginType';
import { EXT_MSG_TYPE_OAUTH_LOGIN } from '@constants/messages';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { oauthGoogleSignIn } from '@oauth/google';
import authService from '@services/auth.service';
import { clearAuthDataFromStorage, getUserInfoFromStorage, storeAuthDataToStorage } from '@utils/auth';
import { fetchLatestConfigOnLogin } from '@utils/config';
import { logger } from '@utils/logger';

import { popupSettingActionType } from './action';
import SectionTitle from './SectionTitle';

const IconButton = ({ Icon, text, onClick, style }) => (
  <Button variant='outlined' onClick={onClick} startIcon={Icon} style={{ fontSize: '98%', margin: '4px 0 -3px', ...style }}>
    {text}
  </Button>
);

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

  const login = async loginPayload => {
    const { token, isNewUser, user } = await authService.login(loginPayload).catch(err => {
      logger(`Login error: ${JSON.stringify(err)}`); // TODO Popup error message
    });
    await storeAuthDataToStorage({ token, user });
    if (!isNewUser) {
      const { latestConfig } = await fetchLatestConfigOnLogin();
      forcePopupRedraw(latestConfig);
    }
    setUserInfo(user);
  };

  const onGoogleSignIn = async () => {
    // Since Google OAuth login does not require user enter credentials on a separate popup window, there's no need to run on background. Also, we can redraw popup immediately
    const loginPayload = await oauthGoogleSignIn();
    await login(loginPayload);
  };

  const onAzureSignIn = async () => {
    // There is a bug on launchWebAuthFlow which cause extension popup page to close unexpectedly. Add this code to make sure every user's popup pages close
    await sendMessage({ type: EXT_MSG_TYPE_OAUTH_LOGIN, payload: { loginMethod: LOGIN_METHOD.AZURE } });
    window.close();
  };

  const signOut = async () => {
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
          <IconButton Icon={<GoogleIcon />} onClick={onGoogleSignIn} text='Sign in with Google' style={{ marginRight: '3.2px' }} />
          <IconButton Icon={<FontAwesomeIcon icon={faMicrosoft} style={{ fontSize: '19px' }} />} onClick={onAzureSignIn} text='Sign in with Microsoft' />
        </>
      ) : (
        <>
          <SectionTitle>
            Hello&nbsp;{userInfo.firstName}&nbsp;
            <SentimentSatisfiedAltIcon style={{ marginBottom: '-4.5px', fontSize: '18px' }} />
          </SectionTitle>
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='body1' component='div'>
              You have collected
              <span style={{ fontWeight: 'bold' }}>&nbsp;{numCollectedWords}&nbsp;</span>
              words!
            </Typography>
            <Button variant='outlined' size='small' onClick={signOut} startIcon={<LogoutIcon />} style={{ fontSize: '90%' }}>
              Sign out
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

IconButton.propTypes = {
  Icon: PropTypes.element.isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  style: {},
};

Profile.propTypes = {
  numCollectedWords: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  numCollectedWords: 0,
};

export default Profile;
