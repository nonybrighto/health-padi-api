import passport from 'passport';
import RateLimit from 'express-rate-limit';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { isAdmin } from '../helpers/admin-helpers';

const loginLimiter = new RateLimit({
  windowMs: 2 * 60 * 1000,
  max: 15,
  message: 'Too many login attempts, please try again after 5 minutes',
  skipSuccessfulRequests: true
});

function jwtRequiredAuthentication(req, res, next) {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    // This token is used to make sure the user is not making use of
    // a token that has been logged out or changed remove if not necessary
    try {
      const userJwtToken =
        req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (err || !user || userJwtToken == null) {
        return next(
          createError(httpStatus.UNAUTHORIZED, 'Request not authorized')
        );
      }
      req.user = user;
    } catch (error) {
      return next(createError('unknown error occured Contact admin'));
    }
    return next();
  })(req, res, next);
}

function jwtOptionalAuthentication(req, res, next) {
  // This token is used to make sure the user is not making use of a token that has been logged out or changed
  // remove if not necessary
  const userJwtToken =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (user && userJwtToken !== null) {
      req.user = user;
    }
    next();
  })(req, res, next);
}

function ownerAccessonly(param) {
  return (req, res, next) => {
    const iParam = req.params[param];
    if (req.user.id !== Number(iParam) && req.user.username !== iParam) {
      return next(createError(httpStatus.FORBIDDEN, 'owner access only'));
    }
    return next();
  };
}
function ownerAdminAccessonly(param) {
  return (req, res, next) => {
    const iParam = req.params[param];
    if (
      req.user.id !== Number(iParam) &&
      req.user.username !== iParam &&
      !isAdmin(req.user.status)
    ) {
      return next(
        createError(httpStatus.FORBIDDEN, 'owner or admin access only')
      );
    }
    return next();
  };
}

export {
  loginLimiter,
  jwtRequiredAuthentication,
  jwtOptionalAuthentication,
  ownerAccessonly,
  ownerAdminAccessonly
};
