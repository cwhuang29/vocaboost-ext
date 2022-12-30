import { COOKIE_NAMES } from '@constants/storage';

import { getCookie } from './cookie';

export const isAdmin = () => getCookie(COOKIE_NAMES.IS_ADMIN);
