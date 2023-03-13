import React, { useEffect, useReducer, useState } from 'react';
import { Stack } from '@mui/material';

import { getCurrentTab, sendMessage, sendMessageToTab } from '@browsers/message';
import { getStorage, setStorage } from '@browsers/storage';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import usePrevious from '@hooks/usePrevious';
import { DEFAULT_CONFIG, isConfigEqual } from '@utils/config';

import { popupSettingActionType } from './action';
import BaseWrapper from './BaseWrapper';
import CollectedWords from './CollectedWords';
import DailyWord from './DailyWord';
import Palette from './Palette';
import Section from './Section';
import SectionTitle from './SectionTitle';
import Setting from './Setting';

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
  const [state, dispatch] = useReducer(settingsReducer, DEFAULT_CONFIG);
  const prevState = usePrevious(state); // Initial value is undefined
  const { config: ctxConfig = {} } = useExtensionMessageContext();

  /*
   * One tab updates config
   * -> Send a message to notify other tabs (background receives this message as well)
   * -> PopupManager (in every tab, if active/open) recieves the message with latest config, and passed it down through context
   * -> Get the latest config from the following function. Update accordingly and notify current tab's content-script
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
      await setStorage({ type: 'sync', key: EXT_STORAGE_CONFIG, value: state });
      // 2. Notify other tabs, extension (popup), and background
      // Note: the extension popups only receive the message if they are active/open.
      //       If they are closed, they will miss the message, and will load the latest config from storage once user clicks ext icon (on browser toolbar)
      sendMessage({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
      // 3. Notify current tab's content-script
      // Note: when we open extension popup as a webpage, there is no content script running. Hence, we should not send messages
      if (isNormalWebPage) {
        sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state, prevState } });
      }
    };
    stateOnChange();
  }, [state]);

  const loadConfig = async () => {
    const cfg = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });
    if (!cfg || Object.keys(cfg).length === 0) {
      setTimeout(loadConfig, 1000);
    } else {
      dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: cfg[EXT_STORAGE_CONFIG] });
    }
  };

  const isThisTabNormalWebPage = async () => {
    // The logic should abide by the manifest's content_scripts.matches (since content scripts only run in those pages)
    // window.location.href.startsWith('http') -> always returns the url of popup, e.g., chrome-extension://dgkojjmldclhegjngnibipblnclmohod/index.html
    const tab = await getCurrentTab();
    setIsNormalWebPage(tab.url?.startsWith('http'));
  };

  useEffect(() => {
    Promise.all([loadConfig(), isThisTabNormalWebPage()]);
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
          <Setting language={state.language} showDetail={state.showDetail} fontSize={state.fontSize} handleChange={handleChange} />
        </Section>
      </Stack>
    </BaseWrapper>
  );
};

export default PopupView;
