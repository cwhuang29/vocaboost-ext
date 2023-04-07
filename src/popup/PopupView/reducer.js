import { popupSettingActionType } from './action';

export const settingsReducer = (state, action) => {
  const { type, payload } = action;

  const updatedAt = new Date();

  switch (type) {
    case popupSettingActionType.CHANGE_HIGHLIGHT_COLOR:
      return { ...state, highlightColor: payload, updatedAt };
    case popupSettingActionType.CHANGE_LANGUAGE:
      return { ...state, language: payloa, updatedAt };
    case popupSettingActionType.CHANGE_FONT_SIZE:
      return { ...state, fontSize: payloa, updatedAt };
    case popupSettingActionType.CHANGE_SHOW_DETAIL:
      return { ...state, showDetail: payloa, updatedAt };
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
