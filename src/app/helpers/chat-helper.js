/* eslint-disable class-methods-use-this */
import firebase from '../../config/firebase-admin';

class ChatHelper {
  async sendChatToFirebase(chat) {
    await firebase
      .firestore()
      .collection('messages')
      .add(chat);
  }

  async createUsersChatHistory(currentUser, receiver, chat) {
    const chatPromise = [];
    const participantIds = [currentUser.id, receiver.id];
    const chatGroupId = this._getChatGroupId(currentUser.id, receiver.id);

    participantIds.forEach(particpantId => {
      chatPromise.push(
        firebase
          .firestore()
          .collection('users')
          .doc(particpantId.toString())
          .collection('chat_history')
          .doc(chatGroupId)
          .set({
            ...chat,
            isSeen: particpantId === currentUser.id,
            sender: {
              id: currentUser.id,
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
              firstName: currentUser.firstName,
              lastName: currentUser.lastName
            },
            receiver: {
              id: receiver.id,
              username: receiver.username,
              avatarUrl: receiver.avatarUrl,
              firstName: receiver.firstName,
              lastName: receiver.lastName
            }
          })
      );
    });
    return Promise.all(chatPromise);
  }

  _getChatGroupId(senderId, receiverId) {
    if (senderId < receiverId) {
      return `${senderId}${receiverId}`;
    }
    return `${receiverId}${senderId}`;
  }
}

export default new ChatHelper();
