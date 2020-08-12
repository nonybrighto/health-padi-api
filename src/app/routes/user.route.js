import express from 'express';
import validate from 'express-validation';
import userController from '../controllers/user.controller';
import { jwtRequiredAuthentication } from '../middlewares/auth.middleware';
import userValidator from '../middlewares/validators/user-validator';
import { fileUploader } from '../helpers/file-uploader';

const router = express.Router();
router
  .route('/')
  .get([jwtRequiredAuthentication], userController.getCurrentUser);

router
  .route('/email')
  .put(
    [jwtRequiredAuthentication, validate(userValidator.updateEmail)],
    userController.updateEmail
  );

router.route('/avatar').put(
  [
    jwtRequiredAuthentication,
    fileUploader.fileUploadHandler({
      fieldName: 'image',
      folder: 'avatars'
    })
  ],
  userController.changeAvatar
);

router
  .route('/password')
  .post(
    [validate(userValidator.changePassword), jwtRequiredAuthentication],
    userController.changePassword
  );

router
  .route('/email-verification')
  .get([jwtRequiredAuthentication], userController.sendVerificationToken);
router
  .route('/email-verification/:verificationToken')
  .post(userController.verifyEmail);

export default router;
