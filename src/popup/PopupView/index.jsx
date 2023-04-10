import React, { useEffect, useReducer, useState } from 'react';
import { Stack } from '@mui/material';

import { getCurrentTab, sendMessage, sendMessageToTab } from '@browsers/message';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { useExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import usePrevious from '@hooks/usePrevious';
import { DEFAULT_CONFIG, getConfig, setURLToConfigFormat, shouldUpdateConfig, storeConfig, trySyncUpConfigToServer } from '@utils/config';

import { popupSettingActionType } from './action';
import BaseWrapper from './BaseWrapper';
import CollectedWords from './CollectedWords';
import DailyWord from './DailyWord';
import Palette from './Palette';
import Profile from './Profile';
import { settingsReducer } from './reducer';
import Section from './Section';
import SectionTitle from './SectionTitle';
import Setting from './Setting';

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
    if (shouldUpdateConfig({ currConfig: ctxConfig, prevConfig: state })) {
      dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: ctxConfig });
      sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state: ctxConfig, prevState: state } });
    }
  }, [ctxConfig]);

  useEffect(() => {
    const stateOnChange = async () => {
      if (!prevState || !shouldUpdateConfig({ currConfig: state, prevConfig: prevState })) {
        return;
      }
      // 1. Sync up to backend (ext popup only runs when user open it, and immediately stop after mouse clicking elsewhere, so the benefit of using websocket is slim)
      const { latestConfig: latestState, isStale } = await trySyncUpConfigToServer(state);
      // 2. Update the latest config to cache
      if (!isStale) {
        await storeConfig(latestState);
      }
      // 3. Notify other tabs, extension (popup), and background. Note that extension popups only receive messages if they are active/open
      sendMessage({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state: latestState, prevState } });
      // 4. Notify current tab's content-script. When opening extension popup as a webpage, there is no content script running. Hence, skip sending the message
      if (urlInfo.startsWith('http')) {
        sendMessageToTab({ type: EXT_MSG_TYPE_CONFIG_UPDATE, payload: { state: latestState, prevState } });
      }
    };
    stateOnChange();
  }, [state]);

  const loadConfig = async () => {
    const cfg = await getConfig();
    const { latestConfig } = await trySyncUpConfigToServer(cfg ?? DEFAULT_CONFIG);
    dispatch({ type: popupSettingActionType.OVERRIDE_ALL, payload: latestConfig });
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
      <Stack spacing={1.5}>
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

        <Section className='profile'>
          <Profile numCollectedWords={state.collectedWords.length} handleChange={handleChange} />
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
