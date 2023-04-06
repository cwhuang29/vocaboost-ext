import React, { useEffect, useReducer, useState } from 'react';
import { Stack } from '@mui/material';

import { getCurrentTab, sendMessage, sendMessageToTab } from '@browsers/message';
import { getStorage, setStorage } from '@browsers/storage';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import usePrevious from '@hooks/usePrevious';
import { DEFAULT_CONFIG, isConfigEqual, setURLToConfigFormat } from '@utils/config';

import { popupSettingActionType } from './action';
import BaseWrapper from './BaseWrapper';
import CollectedWords from './CollectedWords';
import DailyWord from './DailyWord';
import Palette from './Palette';
import Section from './Section';
import SectionTitle from './SectionTitle';
import Setting from './Setting';

const RELOAD_CONFIG_INTERVAL = 600;

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
    case popupSettingActionType.ADD_SUSPENDED_PAGES:
      return { ...state, suspendedPages: [...state.suspendedPages, payload] };
    case popupSettingActionType.DEL_SUSPENDED_PAGES:
      return { ...state, suspendedPages: state.suspendedPages.filter(p => p !== payload) };
    case popupSettingActionType.OVERRIDE_ALL:
      return { ...payload };
    default:
      return state;
  }
};

const PopupView = () => {
  const [urlInfo, setURLInfo] = useState('');
  const [state, dispatch] = useReducer(settingsReducer, DEFAULT_CONFIG);
  const prevState = usePrevious(state); // Initial value is undefined
  const { config: ctxConfig = {} } = useExtensionMessageContext();

  /*
   * 1. One tab updates config
   * 2. Send a message to notify other tabs (background receives this message as well)
   * 3. PopupManager (in every tab, if active/open) recieves the message with latest config, and passed it down through context
   * 4. Get the latest config from the following function. Update accordingly and notify current tab's content-script
   */
  useEffect(() => {
    if (Object.keys(ctxConfig).length > 0 && !isConfigEqual(state, ctxConfig)) {
      dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: ctxConfig });
      sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state: ctxConfig, prevState: state } });
    }
  }, [ctxConfig]);

  useEffect(() => {
    const stateOnChange = async () => {
      if (!prevState || isConfigEqual(state, prevState)) {
        return;
      }
      // 1. Update the latest config to cache
      await setStorage({ type: 'local', key: EXT_STORAGE_CONFIG, value: state });
      // 2. Notify other tabs, extension (popup), and background. Note that extension popups only receive messages if they are active/open
      sendMessage({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
      // 3. Notify current tab's content-script. When opening extension popup as a webpage, there is no content script running. Hence, skip sending the message
      if (urlInfo.startsWith('http')) {
        sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
      }
    };
    stateOnChange();
  }, [state]);

  const loadConfig = async () => {
    const cfg = await getStorage({ type: 'local', key: EXT_STORAGE_CONFIG });
    if (!cfg || Object.keys(cfg).length === 0) {
      setTimeout(loadConfig, RELOAD_CONFIG_INTERVAL);
    } else {
      dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: cfg[EXT_STORAGE_CONFIG] });
    }
  };

  const prepareURLInfo = async () => {
    // window.location.href.startsWith('http') -> always returns the url of popup, e.g., chrome-extension://dgkojjmldclhegjngnibipblnclmohod/index.html
    const tab = await getCurrentTab();
    const url = new URL(tab.url);
    setURLInfo(setURLToConfigFormat(url));
  };

  useEffect(() => {
    Promise.all([loadConfig(), prepareURLInfo()]);
  }, []);

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

        <Section className='collected-words'>
          <SectionTitle>Your collection</SectionTitle>
          <CollectedWords config={state} handleChange={handleChange} />
        </Section>

        <Section className='palette'>
          <SectionTitle>Highlight color</SectionTitle>
          <Palette color={state.highlightColor} handleChange={handleChange} />
        </Section>

        <Section className='setting'>
          <SectionTitle>Settings</SectionTitle>
          <Setting
            language={state.language}
            showDetail={state.showDetail}
            fontSize={state.fontSize}
            suspendedPages={state.suspendedPages}
            urlInfo={urlInfo}
            handleChange={handleChange}
          />
        </Section>
      </Stack>
    </BaseWrapper>
  );
};

export default PopupView;
