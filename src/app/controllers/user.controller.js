import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import { generateRandomToken } from '../helpers/general';
import EmailHelper from '../helpers/email-helper';
import internalError from '../helpers/internal-error';
import { FileUploader } from '../helpers/file-uploader';
import config from '../../config/config';

const { User } = models;
const { EmailVerificationToken } = models;

async function getCurrentUser(req, res, next) {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.scope(['withHidden']).findByPk(
      currentUserId
    );

    return res.status(httpStatus.OK).send(currentUser);
  } catch (error) {
    return next(internalError('getting current user', error));
  }
}

async function changeAvatar(req, res, next) {
  try {
    if (!req.file) {
      return next(
        createError(
          httpStatus.UNPROCESSABLE_ENTITY,
          req.file ? 'Invalid file type' : 'Image file should be present'
        )
      );
    }

    const currentUserId = req.user.id;
    await User.update(
      { avatarUrl: FileUploader.generateSavePath(req.file) },
      { where: { id: currentUserId } }
    );

    const updatedUser = await User.scope(['withHidden']).findByPk(
      currentUserId
    );
    return res.status(httpStatus.OK).send(updatedUser);
  } catch (error) {
    return next(internalError('changing profile avatar', error));
  }
}

async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.canLogin(req.user.username, oldPassword);
    if (user) {
      const changed = await user.changePassword(newPassword);
      if (changed) {
        return res.sendStatus(httpStatus.NO_CONTENT);
      }
      throw new Error('Could not change password');
    } else {
      return next(createError(httpStatus.FORBIDDEN, 'Old password incorrect'));
    }
  } catch (error) {
    return next(internalError('changing password', error));
  }
}

async function sendVerificationToken(req, res, next) {
  try {
    const currentUserId = req.user.id;

    const currentUser = await User.scope('withHidden').findOne({
      where: { id: currentUserId, isEmailVerified: false }
    });

    if (!currentUser) {
      return next(
        createError(httpStatus.CONFLICT, 'Your email is already verified')
      );
    }
    const generatedToken = generateRandomToken();

    const tokenObject = {
      userId: currentUserId,
      token: generatedToken
    };

    const userToken = await EmailVerificationToken.findOne({
      where: { userId: currentUserId }
    });
    if (userToken) {
      await userToken.update(tokenObject);
    } else {
      await EmailVerificationToken.create(tokenObject);
    }

    // sendEmailToUser
    const emailHelper = new EmailHelper();
    const baseUrl = config.get('base-url');
    const sentEmail = await emailHelper.sendEmail({
      to: currentUser.email,
      from: EmailHelper.recoveryEmail,
      subject: 'Verify health padi email',
      text: `Visit this link to verify email. ${baseUrl}/email-verification/${generatedToken}`
    });

    if (sentEmail) {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }
    throw new Error('Could not send email');
  } catch (error) {
    return next(internalError('sending verification email', error));
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const token = await EmailVerificationToken.findOne({
      where: { token: verificationToken }
    });

    if (!token || _isOldTokenOld(token.updatedAt)) {
      return next(createError(httpStatus.NOT_FOUND, 'token not found'));
    }
    await User.update(
      { isEmailVerified: true },
      { where: { id: token.userId } }
    );
    await token.destroy();
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return next(internalError('verifying user', error));
  }
}

async function updateEmail(req, res, next) {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    const emailExists = await User.findOne({
      where: {
        email
      }
    });
    if (emailExists) {
      return next(createError(httpStatus.FORBIDDEN, 'Email already exists'));
    }
    await User.update(
      {
        email,
        isEmailVerified: false
      },
      {
        where: {
          id: userId
        }
      }
    );
    return res.status(httpStatus.OK).send(email);
  } catch (error) {
    return next(internalError('updating user email', error));
  }
}

// eslint-disable-next-line no-underscore-dangle
function _isOldTokenOld(dateUpdatedString) {
  const updateDate = new Date(dateUpdatedString);
  if (updateDate.getTime() + 1 * 60 * 60 * 1000 < Date.now()) {
    return true;
  }
  return false;
}

export default {
  getCurrentUser,
  changeAvatar,
  changePassword,
  sendVerificationToken,
  verifyEmail,
  updateEmail
};
