import express from 'express';
import validate from 'express-validation';
import authController from '../controllers/auth.controller';
import {
  loginLimiter,
  jwtRequiredAuthentication
} from '../middlewares/auth.middleware';
import userValidator from '../middlewares/validators/user-validator';

const router = express.Router();

router
  .route('/register')
  .post(validate(userValidator.createUser), authController.register);

router.route('/login').post([loginLimiter], authController.login);

router
  .route('/refresh')
  .get([jwtRequiredAuthentication], authController.refreshJwtToken);

router.route('/recovery').post(authController.sendRecoveryToken);
router.route('/recovery/:recoveryToken').get(authController.checkTokenValid);
router.route('/recovery/:recoveryToken').post(authController.changePassword);

router.post('/google/token', authController.googleIdTokenAuth);

router.post('/facebook/token', authController.facebookTokenAuth);

router
  .route('/firebase/token')
  .get([jwtRequiredAuthentication], authController.getFirebaseToken);

export default router;
