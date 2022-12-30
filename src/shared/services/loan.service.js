import apis from '@constants/apis';
import fetch from '@services/roots';

const getCreditCardTx = () => fetch.get(apis.V2.LOAN);

export default {
  getCreditCardTx,
};
