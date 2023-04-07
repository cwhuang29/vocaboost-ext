// https://developer.chrome.com/docs/extensions/reference/identity/#method-getAuthToken
export const getAuthToken = async () => {
  const { token, grantedScopes } = await chrome.identity.getAuthToken({ interactive: true });
  return { token, scopes: grantedScopes };
};
