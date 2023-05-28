import config from '@/config';

import { getAuthTokenFromStorage } from './auth';

export const headers = { 'Content-Type': 'application/json', 'X-VH-Source': 'extension', 'X-VH-Platform': 'web' };

export const getEndpointUrl = ({ path }) => `${config.backendURL}${path}`;

export const getAuthHeader = async () => {
  const token = await getAuthTokenFromStorage();
  const t = token ?? '';
  return { Authorization: `Bearer ${t}` };
};
