import express from 'express';
import validate from 'express-validation';
import chatValidator from '../middlewares/validators/chat-validator';
import chatsController from '../controllers/chats.controller';

const router = express.Router();
router
  .route('/bot')
  .post(validate(chatValidator.sendChat), chatsController.sendBotChat);

export default router;
