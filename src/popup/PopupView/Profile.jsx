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
import authService from '@services/auth.service';
import { clearAuthDataFromStorage, getUserInfoFromStorage } from '@utils/auth';
import { isObjectEmpty } from '@utils/misc';

import { popupSettingActionType } from './action';
import SectionTitle from './SectionTitle';

const IconButton = ({ Icon, loading, text, onClick, style }) => (
  <Button variant='outlined' onClick={onClick} startIcon={Icon} style={{ fontSize: '98%', fontFamily: 'Cera', opacity: loading ? 0.3 : 1, ...style }}>
    {text}
  </Button>
);

const LogoutView = ({ display, userInfo, setUserInfo, numCollectedWords }) => {
  const { firstName } = userInfo;

  const signOut = async () => {
    await authService.logout().catch(() => {}); // For signout, always let user sign out
    await clearAuthDataFromStorage();
    setUserInfo({});
  };

  return (
    display && (
      <>
        <SectionTitle>
          Hello&nbsp;{firstName}&nbsp;
          <SentimentSatisfiedAltIcon style={{ marginBottom: '-4.5px', fontSize: '18px' }} />
        </SectionTitle>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '-6px' }}>
          <Typography variant='body1' component='div' fontFamily='Cera'>
            You have collected
            <span style={{ fontWeight: 'bold' }}>&nbsp;{numCollectedWords}&nbsp;</span>
            words!
          </Typography>
          <Button variant='outlined' size='small' onClick={signOut} startIcon={<LogoutIcon />} style={{ fontSize: '90%', fontFamily: 'Cera' }}>
            Sign out
          </Button>
        </Box>
      </>
    )
  );
};

const LoginView = ({ display, redraw, setUserInfo }) => {
  const [loading, setLoading] = useState(false);

  const onGoogleSignIn = async () => {
    const resp = await sendMessage({ type: EXT_MSG_TYPE_OAUTH_LOGIN, payload: { loginMethod: LOGIN_METHOD.GOOGLE } });
    const { isNewUser, user, config } = resp || {};
    if (!isNewUser && !isObjectEmpty(config)) {
      redraw(config);
    }
    if (!isObjectEmpty(user)) {
      setUserInfo(user);
    }
  };

  const onAzureSignIn = async () => {
    // Note: there's a bug on launchWebAuthFlow which cause extension popup page to close after signing in through Microsoft OAuth popup
    await sendMessage({ type: EXT_MSG_TYPE_OAUTH_LOGIN, payload: { loginMethod: LOGIN_METHOD.AZURE } });
  };

  const onSignIn = loginMethod => async () => {
    setLoading(true);
    if (loginMethod === LOGIN_METHOD.GOOGLE) {
      await onGoogleSignIn();
    }
    if (loginMethod === LOGIN_METHOD.AZURE) {
      await onAzureSignIn();
    }
    setLoading(false);
  };

  return (
    display && (
      <>
        <SectionTitle>Profile (sign in to keep your collected words safely)</SectionTitle>
        <Box style={{ display: 'flex', justifyContent: 'space-between', margin: '0px 0 -1px' }}>
          <IconButton Icon={<GoogleIcon />} loading={loading} onClick={onSignIn(LOGIN_METHOD.GOOGLE)} text='Sign in with Google' />
          <IconButton
            Icon={<FontAwesomeIcon icon={faMicrosoft} style={{ fontSize: '19px' }} />}
            loading={loading}
            onClick={onSignIn(LOGIN_METHOD.AZURE)}
            text='Sign in with Microsoft'
          />
        </Box>
      </>
    )
  );
};

const Profile = ({ numCollectedWords, handleChange }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const setup = async () => {
      const uInfo = await getUserInfoFromStorage();
      if (uInfo) {
        setUserInfo(uInfo);
      }
    };
    setup();
  }, []);

  const forcePopupRedraw = config => {
    handleChange({
      type: popupSettingActionType.OVERRIDE_ALL,
      payload: config,
    });
  };

  const isSignedIn = Object.keys(userInfo).length !== 0;

  return (
    <Box>
      <LoginView display={!isSignedIn} redraw={forcePopupRedraw} setUserInfo={setUserInfo} />
      <LogoutView display={isSignedIn} numCollectedWords={numCollectedWords} userInfo={userInfo} setUserInfo={setUserInfo} />
    </Box>
  );
};

IconButton.propTypes = {
  Icon: PropTypes.element.isRequired,
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  loading: false,
  style: {},
};

LogoutView.propTypes = {
  display: PropTypes.bool,
  numCollectedWords: PropTypes.number,
  userInfo: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

LogoutView.defaultProps = {
  display: false,
  numCollectedWords: 0,
};

LoginView.propTypes = {
  display: PropTypes.bool,
  redraw: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

LoginView.defaultProps = {
  display: false,
};

Profile.propTypes = {
  numCollectedWords: PropTypes.number,
  handleChange: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  numCollectedWords: 0,
};

export default Profile;
