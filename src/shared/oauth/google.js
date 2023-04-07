import config from '@/config.js';

const GOOGLE_PERSON_FIELDS = { NAME: 'names', EMAIL: 'emailAddresses', PHOTO: 'photos' };

const GOOGLE_PEOPLE_API = 'https://people.googleapis.com/v1/people/me';

const constructGoogleAPIURL = ({ field, key }) => `${GOOGLE_PEOPLE_API}?personFields=${field}&key=${key}`;

const getGoogleUserInfoHeader = ({ token }) => ({
  method: 'GET',
  async: true,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  contentType: 'json',
});

const getGoogleUserNameCb = json => ({
  firstName: json[GOOGLE_PERSON_FIELDS.NAME][0].givenName,
  lastName: json[GOOGLE_PERSON_FIELDS.NAME][0].familyName,
});

const getGoogleUserEmailCb = json => ({
  email: json[GOOGLE_PERSON_FIELDS.EMAIL][0].value,
});

const getGoogleUserPhotoCb = json => ({
  avatar: json[GOOGLE_PERSON_FIELDS.PHOTO][0].url,
});

const fetchGoogleAPI = ({ token, url, cb }) => {
  const header = getGoogleUserInfoHeader({ token });
  return fetch(url, header)
    .then(resp => resp.json())
    .then(json => cb(json));
};

export const getGoogleUserInfo = async ({ token }) => {
  const key = config.googleApiKey;

  const [dataName, dataEmail, dataPhoto] = await Promise.all([
    fetchGoogleAPI({ token, cb: getGoogleUserNameCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PERSON_FIELDS.NAME }) }),
    fetchGoogleAPI({ token, cb: getGoogleUserEmailCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PERSON_FIELDS.EMAIL }) }),
    fetchGoogleAPI({ token, cb: getGoogleUserPhotoCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PERSON_FIELDS.PHOTO }) }),
  ]);

  return { ...dataName, ...dataEmail, ...dataPhoto };
};
