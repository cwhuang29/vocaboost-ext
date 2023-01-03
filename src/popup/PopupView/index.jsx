import React, { useEffect, useReducer, useRef, useState } from 'react';

import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import BaseWrapper from '@popup/components/BaseWrapper';
import DailyWord from '@popup/components/DailyWord';
import Palette from '@popup/components/Palette';
import Section from '@popup/components/Section';
import SectionTitle from '@popup/components/SectionTitle';
import Setting from '@popup/components/Setting';
import { popupSettingActionType } from '@popup/helpers/action';
import { getCurrentTab, sendMessage, sendMessageToTab } from '@popup/helpers/message';
import { getStorage, setStorage } from '@popup/helpers/storage';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@shared/constants/messages';
import { EXT_STORAGE_CONFIG } from '@shared/constants/storage';
import usePrevious from '@shared/hooks/usePrevious';
import { getDefaultConfig, isConfigEqual } from '@shared/utils/config';

import { Stack } from '@mui/material';

const settingsReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case popupSettingActionType.CHANGE_HIGHLIGHT_COLOR:
      return { ...state, highlightColor: payload };
    case popupSettingActionType.CHANGE_LANGUAGE:
      return { ...state, language: payload };
    case popupSettingActionType.CHANGE_FONT_SIZE:
      return { ...state, fontSize: payload };
    case popupSettingActionType.CHANGE_SHOW_DETAIL:
      return { ...state, showDetail: payload };
    case popupSettingActionType.OVERRIDE_ALL:
      return { ...payload };
    default:
      return state;
  }
};

const PopupView = () => {
  const [isNormalWebPage, setIsNormalWebPage] = useState(false);
  const [state, dispatch] = useReducer(settingsReducer, getDefaultConfig());
  const prevState = usePrevious(state); // Initial value is undefined
  const { config: cxtConfig = {} } = useExtensionMessageContext();
  const prevConfigFromManager = useRef('{}');

  const loadConfig = async () => {
    const cfg = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });
    if (!cfg || Object.keys(cfg).length === 0) {
      setTimeout(loadConfig, 1000);
    } else {
      dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: cfg[EXT_STORAGE_CONFIG] });
    }
  };

  const isThisTabNormalWebPage = async () => {
    // The logic should match the manifest's content_scripts.matches (since content scripts only run in those pages)
    // window.location.href.startsWith('http') -> always returns the url of popup, e.g., chrome-extension://dgkojjmldclhegjngnibipblnclmohod/index.html
    const tab = await getCurrentTab();
    setIsNormalWebPage(tab.url.startsWith('http'));
  };

  const stateOnChange = async () => {
    if (!prevState || isConfigEqual(state, cxtConfig) || isConfigEqual(state, prevState)) {
      return;
    }
    // 1. Update the latest config to cache
    await setStorage({ type: 'sync', key: EXT_STORAGE_CONFIG, value: state });
    // 2. Notify other tabs, extension (popup), and background
    // Note: unless open tabs in multiple windows with extension popup opened, otherwise the entire popup in that tab will not be executed
    // i.e., those tabs won't receive this mesage. They will update their style once the user click the extension icon then load latest config
    sendMessage({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
    // 3. Notify current tab's content-script (sends a message to content script running in webpage)
    // Note: when we open extension popup as a webpage, there is no content script running. Hence, we should not send messages
    // Otherwise it raises error: "Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist."
    if (isNormalWebPage) {
      sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
    }
  };

  /*
   * Other tab update config -> send a message to notify other tabs (and background) -> PopupManager (in every tab) recieves the message with latest config
   * -> the latest config is passed down through context -> get the latest config here and update accordingly
   */
  if (Object.keys(cxtConfig).length > 0 && !isConfigEqual(JSON.parse(prevConfigFromManager.current), cxtConfig) && !isConfigEqual(state, cxtConfig)) {
    prevConfigFromManager.current = JSON.stringify(cxtConfig);
    dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: cxtConfig });
    sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state: cxtConfig, prevState: state } }); // Notify current tab's content-script
  }

  useEffect(() => {
    Promise.all([loadConfig(), isThisTabNormalWebPage()]);
  }, []);
  useEffect(() => stateOnChange(), [state]);

  const handleChange = value => {
    dispatch(value);
  };

  return (
    <BaseWrapper>
      <Stack spacing={2}>
        <Section className='daily-word'>
          <SectionTitle>Daily word</SectionTitle>
          <DailyWord language={state.language} />
        </Section>

        <Section className='palette'>
          <SectionTitle>Highlight color</SectionTitle>
          <Palette color={state.highlightColor} handleChange={handleChange} />
        </Section>

        <Section className='setting'>
          <SectionTitle>Settings</SectionTitle>
          <Setting language={state.language} showDetail={state.showDetail} fontSize={state.fontSize} handleChange={handleChange} />
        </Section>
      </Stack>
    </BaseWrapper>
  );
};

export default PopupView;
