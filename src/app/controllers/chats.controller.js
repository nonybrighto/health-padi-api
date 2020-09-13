import httpStatus from 'http-status';
import { SessionsClient } from 'dialogflow';
import { v4 as uuidv4 } from 'uuid';
import internalError from '../helpers/internal-error';
import firebase from '../../config/firebase-admin';
import config from '../../config/config';

async function sendBotChat(req, res, next) {
  try {
    const { content, deviceIdentifier, id } = req.body;
    let { sessionId } = req.body;

    sessionId = sessionId || uuidv4();
    const projectId = config.get('firebase-project-id');
    const sessionClient = new SessionsClient({
      credentials: {
        project_id: config.get('firebase-project-id'),
        private_key: config.get('df-private-key').replace(/\\n/g, '\n'),
        client_email: config.get('df-client-email')
      }
    });
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: content,
          languageCode: 'en-US'
        }
      }
    };

    const result = await Promise.all([
      firebase
        .firestore()
        .collection('bot_chats')
        .doc(id)
        .set({
          deviceIdentifier,
          content,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }),
      sessionClient.detectIntent(request)
    ]);

    const dialogFlowResponse = result[1];

    await firebase
      .firestore()
      .collection('bot_chats')
      .add({
        deviceIdentifier,
        isBotMessage: true,
        content: dialogFlowResponse.fulfillmentText,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    return res.status(httpStatus.OK).send(sessionId);
  } catch (error) {
    return next(internalError('sending chat', error));
  }
}

export default {
  sendBotChat
};
