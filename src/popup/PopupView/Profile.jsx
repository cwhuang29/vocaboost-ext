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
  <Button variant='outlined' onClick={onClick} startIcon={Icon} style={{ fontSize: '98%', margin: '4px 0 -3px', opacity: loading ? 0.3 : 1, ...style }}>
    {text}
  </Button>
);

const Profile = ({ numCollectedWords, handleChange }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

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

  const onGoogleSignIn = async () => {
    const resp = await sendMessage({ type: EXT_MSG_TYPE_OAUTH_LOGIN, payload: { loginMethod: LOGIN_METHOD.GOOGLE } });
    const { isNewUser, user, config } = resp || {};
    if (!isNewUser && !isObjectEmpty(config)) {
      forcePopupRedraw(config);
    }
    if (!isObjectEmpty(user)) {
      setUserInfo(user);
    }
  };

  const onAzureSignIn = async () => {
    // There is a bug on launchWebAuthFlow which cause extension popup page to close after signing in through Microsoft OAuth popup window
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

  const signOut = async () => {
    await authService.logout().catch(() => {}); // For logout, just ignore error message
    await clearAuthDataFromStorage();
    setUserInfo({});
  };

  const isSignedIn = Object.keys(userInfo).length !== 0;

  return (
    <Box>
      {!isSignedIn ? (
        <>
          <SectionTitle>Profile (sign in to keep your collected words safely)</SectionTitle>
          <IconButton
            Icon={<GoogleIcon />}
            loading={loading}
            onClick={onSignIn(LOGIN_METHOD.GOOGLE)}
            text='Sign in with Google'
            style={{ marginRight: '3.2px' }}
          />
          <IconButton
            Icon={<FontAwesomeIcon icon={faMicrosoft} style={{ fontSize: '19px' }} />}
            loading={loading}
            onClick={onSignIn(LOGIN_METHOD.AZURE)}
            text='Sign in with Microsoft'
          />
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
  loading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};

IconButton.defaultProps = {
  loading: false,
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
