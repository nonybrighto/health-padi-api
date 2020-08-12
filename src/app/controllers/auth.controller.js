import createError from 'http-errors';
import httpStatus from 'http-status';
import passport from 'passport';
import models from '../models';
import internalError from '../helpers/internal-error';
import EmailHelper from '../helpers/email-helper';
import firebase from '../../config/firebase-admin';
import { generateRandomToken } from '../helpers/general';
import config from '../../config/config';

const { User, RecoveryToken } = models;

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ where: { email: req.body.email } })) {
      next(createError(httpStatus.CONFLICT, 'Email already exists'));
    } else if (await User.findOne({ where: { username: req.body.username } })) {
      next(createError(httpStatus.CONFLICT, 'username already exists'));
    } else {
      const transaction = await models.sequelize.transaction();
      const userRegistered = await User.createUser(
        {
          username,
          email,
          password,
          avatarUrl: null
        },
        {
          transaction
        }
      );

      await transaction.commit();
      const userToSend = await User.scope([
        'defaultScope',
        'withEmail'
      ]).findByPk(userRegistered.id);

      res.status(httpStatus.CREATED).send(userToSend.toAuthJSON());
    }
  } catch (error) {
    next(internalError('registering user', error));
  }
}

async function login(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      let message = 'Login failed';
      if (err) {
        message = err.message;
      } else if (info) {
        message = info.message;
      }
      return next(createError(httpStatus.BAD_REQUEST, message));
    }
    return req.login(user, { session: false }, async erri => {
      if (erri) {
        return next(createError(httpStatus.BAD_REQUEST, 'Login failed'));
      }
      const userToSend = await User.scope([
        'defaultScope',
        'withEmail'
      ]).findByPk(user.id);
      return res.status(httpStatus.OK).send(userToSend.toAuthJSON());
    });
  })(req, res, next);
}

async function refreshJwtToken(req, res, next) {
  try {
    const { user } = req;
    if (user) {
      const userToSend = await User.scope([
        'defaultScope',
        'withEmail',
        'withAssociations'
      ]).findByPk(user.id);

      res.status(httpStatus.OK).send(userToSend.toAuthJSON());
    } else {
      next(
        createError(
          httpStatus.NOT_FOUND,
          'Error occured while refreshing token'
        )
      );
    }
  } catch (error) {
    next(internalError('refreshing token', error));
  }
}

async function googleIdTokenAuth(req, res, next) {
  passport.authenticate(
    'google-id-token',
    { session: false },
    async (err, user, info) => {
      if (err || info) {
        return next(
          createError(httpStatus.BAD_REQUEST, 'Google authentication failed')
        );
      }

      const userToSend = await User.scope([
        'defaultScope',
        'withEmail',
        'withAssociations'
      ]).findByPk(user.id);
      return res.status(httpStatus.OK).send(userToSend.toAuthJSON());
    }
  )(req, res, next);
}

function facebookTokenAuth(req, res, next) {
  passport.authenticate(
    'facebook-token',
    { session: false },
    async (err, user, info) => {
      if (err || info) {
        return next(
          createError(httpStatus.BAD_REQUEST, 'Facebook authentication failed')
        );
      }
      const userToSend = await User.scope([
        'defaultScope',
        'withEmail',
        'withAssociations'
      ]).findByPk(user.id);
      return res.status(httpStatus.OK).send(userToSend.toAuthJSON());
    }
  )(req, res, next);
}

async function sendRecoveryToken(req, res, next) {
  try {
    const userEmail = req.body.email;

    const userWithEmail = await User.findOne({ where: { email: userEmail } });

    if (!userWithEmail) {
      return next(
        createError(httpStatus.NOT_FOUND, 'No user with this email account')
      );
    }
    const generatedToken = generateRandomToken();

    const tokenObject = {
      userId: userWithEmail.id,
      token: generatedToken
    };

    const userToken = await RecoveryToken.findOne({
      where: { userId: userWithEmail.id }
    });
    if (userToken) {
      await userToken.update(tokenObject);
    } else {
      await RecoveryToken.create(tokenObject);
    }

    // sendEmailToUser
    const emailHelper = new EmailHelper();
    const baseUrl = config.get('base-url');
    const sentEmail = await emailHelper.sendEmail({
      to: userEmail,
      from: EmailHelper.recoveryEmail,
      subject: 'Reset password',
      text: `Visit this link to reset password ${baseUrl}/password-token/${generatedToken}`
    });

    if (sentEmail) {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
    throw new Error('Could not send email');
  } catch (error) {
    return next(internalError('sending recovery email', error));
  }
}
async function checkTokenValid(req, res, next) {
  try {
    const { recoveryToken } = req.params;
    const token = await RecoveryToken.findOne({
      where: { token: recoveryToken }
    });
    if (!token || _isOldTokenOld(token.updatedAt)) {
      return next(createError(httpStatus.NOT_FOUND, 'token not found'));
    }
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return next(internalError('sending recovery email', error));
  }
}
async function changePassword(req, res, next) {
  try {
    const { recoveryToken } = req.params;
    const { newPassword } = req.body;

    const token = await RecoveryToken.findOne({
      where: { token: recoveryToken }
    });
    if (!token || _isOldTokenOld(token.updatedAt)) {
      // or date too old
      return next(createError(httpStatus.NOT_FOUND, 'token not found'));
    }

    const user = await User.findByPk(token.userId);

    if (user) {
      const changed = await user.changePassword(newPassword);
      if (changed) {
        await token.destroy();
        return res.sendStatus(httpStatus.NO_CONTENT);
      }
      throw new Error('Could not change password');
    } else {
      return next(
        createError(httpStatus.FORBIDDEN, 'not permitted to change password')
      );
    }
  } catch (error) {
    return next(internalError('changing password', error));
  }
}

async function getFirebaseToken(req, res, next) {
  try {
    const currentUser = req.user;
    const token = await firebase
      .auth()
      .createCustomToken(currentUser.id.toString(), {
        username: currentUser.username,
        email: currentUser.email,
        userStatus: currentUser.userStatus,
        id: currentUser.id,
        avatarUrl: currentUser.avatarPhotoUrl,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      });
    res.status(httpStatus.OK).send(token);
  } catch (error) {
    next(internalError('getting token', error));
  }
}

// eslint-disable-next-line no-underscore-dangle
function _isOldTokenOld(dateUpdatedString) {
  const updateDate = new Date(dateUpdatedString);
  //  updateDate.setTime(updateDate.getTime() + 1 * 60 * 60 * 1000); // add expire hour of 1

  //  if(updateDate < new Date()){
  //     return true;
  //  }
  //  return false;
  if (updateDate.getTime() + 1 * 60 * 60 * 1000 < Date.now()) {
    return true;
  }
  return false;
}

export default {
  register,
  login,
  refreshJwtToken,
  googleIdTokenAuth,
  facebookTokenAuth,
  sendRecoveryToken,
  checkTokenValid,
  changePassword,
  getFirebaseToken
};
