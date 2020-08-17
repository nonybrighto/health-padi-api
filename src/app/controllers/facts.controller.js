import httpStatus from 'http-status';
import models from '../models';
import listResponse from '../helpers/list-response';
import internalError from '../helpers/internal-error';

const { Fact, FactCategory } = models;

async function getAllFacts(req, res, next) {
  try {
    const { categoryId, random } = req.query;

    return listResponse({
      getItemsWithCount: async (offset, limit) =>
        Fact.findAndCountAll({
          offset,
          limit,
          order: random
            ? models.sequelize.literal('random()')
            : [['createdAt', 'DESC']],
          include: [
            {
              model: FactCategory,
              as: 'category'
            }
          ],
          where: {
            ...(categoryId && {
              categoryId
            })
          }
        }),
      errorMessage: 'getting facts'
    })(req, res, next);
  } catch (error) {
    return next(internalError('getting facts', error));
  }
}

async function getAllFactCategories(req, res, next) {
  try {
    const categories = await FactCategory.findAll();
    return res.status(httpStatus.OK).send(categories);
  } catch (error) {
    return next(internalError('getting user', error));
  }
}

export default {
  getAllFacts,
  getAllFactCategories
};
