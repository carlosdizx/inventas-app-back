import { v4 as uuid } from 'uuid';
const generateClientCredentialsUtil = () => ({
  clientId: uuid().split('-').join(''),
  clientSecret: uuid().split('-').join(''),
});

export default generateClientCredentialsUtil;
