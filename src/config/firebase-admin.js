import * as fb from 'firebase-admin';
import config from './config';

// console.log(__dirname + "/service-account-key.json");
fb.initializeApp({
  credential: fb.credential.cert({
    project_id: 'mentorapp-test',
    private_key: config.get('firebase-private-key').replace(/\\n/g, '\n'),
    client_email: config.get('firebase-client-email')
  }),
  databaseURL: config.get('firebase-database-url')
});

export default fb;
