import { useSelector } from 'react-redux';

import getAuth from '@selectors/auth';

const useAuth = () => useSelector(state => getAuth(state));

export default useAuth;
