const authTypes = {
  BASIC: 'Basic Auth',
  DIGEST: 'Digest Auth',
  OAUTH2: 'OAuth2',
};

/**
 * Executes the verification logic by checking that fields are not empty using the provided apiKey.
 *
 * @param credentials object to retrieve apiKey from
 * @returns Promise which resolves true
 */
function verify(credentials) {
  this.logger.debug('credentials:', JSON.stringify(credentials));
  // access the value of the auth field defined in credentials section of component.json
  const { type, basic, oauth2 } = credentials.auth;

  if (type === authTypes.BASIC) {
    if (!basic.username) {
      this.logger.info('Error: Username is required for basic auth');
      throw new Error('Username is required for basic auth');
    }

    if (!basic.password) {
      this.logger.info('Error: Password is required for basic auth');
      throw new Error('Password is required for basic auth');
    }
  } else if (type === authTypes.OAUTH2) {
    const { keys } = oauth2;
    if (!keys) {
      this.logger.error('Error: OAuth2 provider hasn`t returned keys for current credentials');
      throw new Error('OAuth2 provider hasn`t returned keys for current credentials');
    } else if (!keys.access_token) {
      this.logger.error('Error: OAuth2 provider hasn`t returned an access_token: %s', keys);
      throw new Error('OAuth2 provider hasn`t returned an access_token');
    } else if (!keys.refresh_token) {
      this.logger.error('Error: OAuth2 provider hasn`t returned a refresh_token. Possible reason: missing access_type:offline additional parameter');
      throw new Error('OAuth2 provider hasn`t returned a refresh_token. Possible reason: missing access_type:offline additional parameter');
    }
  }

  return Promise.resolve(true);
}

module.exports = verify;
