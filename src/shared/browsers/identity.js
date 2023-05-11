import Browser from 'webextension-polyfill';

// See https://developer.chrome.com/docs/extensions/reference/identity

// Gets an OAuth2 access_token using the client ID and scopes specified in the oauth2 section of manifest.json
// The Identity API caches access tokens in memory, so it's ok to call getAuthToken non-interactively any time a token is required. The token cache automatically handles expiration
export const getAuthToken = async () => {
  const { token, grantedScopes } = await chrome.identity.getAuthToken({ interactive: true });
  return { token, scopes: grantedScopes };
};

// Starts an auth flow at the specified URL.
// This method enables auth flows with non-Google identity providers by launching a web view and navigating it to the first URL in the provider's auth flow
// When the provider redirects to a URL matching the pattern https://<app-id>.chromiumapp.org/*, the window will close, and the final redirect URL will be passed to the callback function
export const launchWebAuthFlow = async ({ url }) => {
  const result = await chrome.identity.launchWebAuthFlow({ url, interactive: true });
  return result;
};

// Generates a redirect URL to be used in launchWebAuthFlow. Note that there's a slash in the end of URL!
// The value is equal to `https://${chrome.runtime.id}.chromiumapp.org/`
export const getOauthRedirectUrl = () => {
  const redirectUrl = chrome.identity.getRedirectURL();
  return redirectUrl;
};

export const getOauthScopes = () => {
  const manifest = Browser.runtime.getManifest();
  const scopes = encodeURIComponent(manifest.oauth2.scopes.join(' '));
  return scopes;
};

export const getOauthClientId = () => {
  const manifest = Browser.runtime.getManifest();
  const clientId = encodeURIComponent(manifest.oauth2.client_id);
  return clientId;
};
