import nconf from 'nconf';

nconf
  .argv()
  .env()
  .file({ file: `${__dirname}/env.json` });

const environment = nconf.get('env') || 'development';

// used to get test sspecific configurations - file will not be read during production.
if (environment === 'test') {
  nconf.file(`${__dirname}/test.json`);
}

nconf.defaults({
  env: 'development',
  'base-url': 'http://192.168.43.202:3000',
  'jwt-secret': '0a6b357d-d2fb-46fc-a84e-0295a986cd9f',
  'facebook-client-id': '1b511234-41d5-456e-54b0-cda1fe1f3341',
  'facebook-client-secret': '1b511234-41d5-456e-54b0-cda1fe1f3341',
  'google-client-id': '1b512364-213e-456e-54b0-cda1fe1f3341',
  'jwt-token-expire-days': 30,
  'email-host': 'themeial',
  'no-reply-email': 'themeial',
  'email-password': 'the password',
  'firebase-project-id': '',
  'firebase-private-key': '',
  'firebase-client-email': '',
  'firebase-database-url': '',
  'watson-discovery-api-key': 'no key',
  'watson-discovery-version': '2019-04-30',
  'watson-discovery-url': 'no url',
  'df-private-key': '',
  'df-client-email': ''
});

export default nconf;
