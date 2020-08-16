import httpStatus from 'http-status';
import internalError from '../helpers/internal-error';
import firebase from '../../config/firebase-admin';
import config from '../../config/config';

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

async function sendBotChat(req, res, next) {
  try {
    const { content, deviceIdentifier, id } = req.body;
    let { sessionId } = req.body;

    const assistant = new AssistantV2({
      version: config.get('watson-assistant-version'),
      authenticator: new IamAuthenticator({
        apikey: config.get('watson-assistant-api-key')
      }),
      url: config.get('watson-assistant-url')
    });

    if (!sessionId) {
      const session = await assistant.createSession({
        assistantId: config.get('watson-assistant-id')
      });
      sessionId = session.result.session_id;
    }

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
      assistant.message({
        assistantId: config.get('watson-assistant-id'),
        sessionId,
        input: { text: content }
      })
    ]);

    const assistantResponse = result[1];

    await firebase
      .firestore()
      .collection('bot_chats')
      .add({
        deviceIdentifier,
        isBotMessage: true,
        content: assistantResponse.result.output.generic[0].text,
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
