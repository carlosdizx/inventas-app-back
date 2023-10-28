import generateClientCredentialsUtil from './generate.client.credentials.util';

describe('generateClientCredentialsUtil', () => {
  it('should return an object with clientId and clientSecret properties', () => {
    const credentials = generateClientCredentialsUtil();
    expect(credentials).toHaveProperty('clientId');
    expect(credentials).toHaveProperty('clientSecret');
  });

  it('should generate different credentials each time it is called', () => {
    const credentials1 = generateClientCredentialsUtil();
    const credentials2 = generateClientCredentialsUtil();
    expect(credentials1.clientId).not.toEqual(credentials2.clientId);
    expect(credentials1.clientSecret).not.toEqual(credentials2.clientSecret);
  });

  it('should remove hyphens from the generated values', () => {
    const credentials = generateClientCredentialsUtil();
    expect(credentials.clientId).not.toMatch(/-/);
    expect(credentials.clientSecret).not.toMatch(/-/);
  });
});
