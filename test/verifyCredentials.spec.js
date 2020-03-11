const { expect } = require('chai');
const logger = require('@elastic.io/component-logger')();
const verify = require('../verifyCredentials');

describe('verifyCredentials test', () => {
  const emitter = {
    logger,
  };

  describe('oauth2 credentials', () => {
    const credentials = {
      auth: {
        type: 'OAuth2',
        oauth2: {
          clientId: 'clientId',
          clientSecret: 'clientSecret',
          authUri: 'https://example.com/oauth/v2/auth',
          tokenUri: 'https://example.com/oauth/v2/token',
          scopes: [
            'Example.fullaccess.all',
          ],
          additionalProperties: {},
          keys: {},
        },
      },
    };

    it('should fail if auth.oauth2.keys is missing', async () => {
      credentials.auth.oauth2.keys = undefined;
      try {
        await verify.call(emitter, credentials);
        throw new Error('This line should never be called because await above should throw an error');
      } catch (err) {
        expect(err.message).equal('OAuth2 provider hasn`t returned keys for current credentials');
      }
    });

    it('should fail if auth.oauth2.keys.access_token is missing', async () => {
      credentials.auth.oauth2.keys = {
        error: 'invalid_client_secret',
      };
      try {
        await verify.call(emitter, credentials);
        throw new Error('This line should never be called because await above should throw an error');
      } catch (err) {
        expect(err.message).equal('OAuth2 provider hasn`t returned an access_token');
      }
    });

    it('should fail if auth.oauth2.keys.refresh_token is missing', async () => {
      credentials.auth.oauth2.keys = {
        access_token: 'access_token',
      };
      try {
        await verify.call(emitter, credentials);
        throw new Error('This line should never be called because await above should throw an error');
      } catch (err) {
        expect(err.message).equal('OAuth2 provider hasn`t returned a refresh_token. Possible reason: missing access_type:offline additional parameter');
      }
    });
  });
});