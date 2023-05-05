export default {
  LOCAL_HOST: 'http://127.0.0.1:8000',
  HOST: 'https://api.vocabularyboost.com',
  V1: {
    ME: '/v1/users/me',
    LOGIN: '/v1/login',
    LOGOUT: '/v1/logout',
    SETTING: '/v1/users/setting',
    SETTING_COLLECTED_WORDS: '/v1/users/setting/collected-words',
  },
  OAUTH: {
    AZURE: {
      AVATAR: 'https://graph.microsoft.com/v1.0/me/photo/$value',
      AVATAR_360: 'https://graph.microsoft.com/v1.0/me/photos/360x360/$value', // 48x48, 64x64, 96x96, 120x120, 240x240, 360x360, 432x432, 504x504, and 648x648
    },
  },
  OFFICAIL_HOME_PAGE: 'https://www.vocabularyboost.com',
};
