import httpStatus from 'http-status';
import Pagination from './pagination';
import internalError from './internal-error';

function listResponse({
  itemCount,
  errorMessage,
  getItems,
  getItemsWithCount
}) {
  return async (req, res, next) => {
    try {
      const { page } = req.query;
      const { limit } = req.query;
      const pagination = new Pagination(itemCount, page, limit);
      let gottenItems;
      if (getItems) {
        gottenItems = await getItems(pagination.getOffset(), limit);
      } else {
        const result = await getItemsWithCount(pagination.getOffset(), limit);
        gottenItems = result.rows;
        pagination.setTotalCount(result.count);
      }
      return res.status(httpStatus.OK).send({
        ...pagination.generatePaginationObject(),
        results: gottenItems
      });
    } catch (error) {
      return next(internalError(errorMessage || 'getting items', error));
    }
  };
}

export default listResponse;
