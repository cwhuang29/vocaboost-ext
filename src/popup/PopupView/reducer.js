import { getLocalDate } from '@utils/time';

import { popupSettingActionType } from './action';

export const settingsReducer = (state, action) => {
  const { type, payload } = action;

  const updatedAt = getLocalDate();

  switch (type) {
    case popupSettingActionType.CHANGE_HIGHLIGHT_COLOR:
      return { ...state, highlightColor: payload, updatedAt };
    case popupSettingActionType.CHANGE_LANGUAGE:
      return { ...state, language: payload, updatedAt };
    case popupSettingActionType.CHANGE_FONT_SIZE:
      return { ...state, fontSize: payload, updatedAt };
    case popupSettingActionType.CHANGE_SHOW_DETAIL:
      return { ...state, showDetail: payload, updatedAt };
    case popupSettingActionType.ADD_SUSPENDED_PAGES:
      return { ...state, suspendedPages: [...state.suspendedPages, payload], updatedAt };
    case popupSettingActionType.DEL_SUSPENDED_PAGES:
      return { ...state, suspendedPages: state.suspendedPages.filter(p => p !== payload), updatedAt };
    case popupSettingActionType.OVERRIDE_ALL:
      return { ...payload };
    default:
      return state;
  }
};
