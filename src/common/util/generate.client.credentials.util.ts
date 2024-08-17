import { randomUUID as uuid } from 'node:crypto';
const generateClientCredentialsUtil = () => ({
  clientId: uuid().split('-').join(''),
  clientSecret: uuid().split('-').join(''),
});

export default generateClientCredentialsUtil;
