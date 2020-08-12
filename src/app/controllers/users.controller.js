import httpStatus from 'http-status';
import createError from 'http-errors';
import models from '../models';
import listResponse from '../helpers/list-response';
import internalError from '../helpers/internal-error';

const { User } = models;
const { Op } = models.Sequelize;

async function getAllUsers(req, res, next) {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const { fetchType } = req.query;
    if (fetchType && (!currentUserId || req.user.userStatus === 0)) {
      return next(createError(httpStatus.FORBIDDEN, 'view not allowed'));
    }

    const whereObject = {
      ...(fetchType === 'blocked' && { isBlocked: true }),
      ...(fetchType === 'active' && { isBlocked: false }),
      ...(fetchType === 'admins' && { userStatus: { [Op.gte]: 1 } })
    };

    return listResponse({
      itemCount: await User.scope(!fetchType ? 'defaultScope' : {}).count({
        where: whereObject
      }),
      getItems: async (skip, limit) =>
        User.scope([
          ...(!fetchType ? ['defaultScope'] : []),
          ...(currentUserId && req.user.userStatus > 0 ? ['withEmail'] : [])
        ]).findAll({
          offset: skip,
          limit,
          where: whereObject
        }),
      errorMessage: 'getting users'
    })(req, res, next);
  } catch (error) {
    return next(internalError('getting users', error));
  }
}

async function getUser(req, res, next) {
  try {
    const { userParam } = req.params;

    const user = await User.findOne({
      where: Number.isNaN(Number(userParam))
        ? { username: userParam }
        : { id: userParam }
    });
    if (!user) {
      return next(createError(httpStatus.NOT_FOUND, 'User could not be found'));
    }
    return res.status(httpStatus.OK).send(user);
  } catch (error) {
    return next(internalError('getting user', error));
  }
}

export default {
  getAllUsers,
  getUser
};
