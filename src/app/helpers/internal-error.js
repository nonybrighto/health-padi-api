import createError from 'http-errors';
import httpStatus from 'http-status';

function internalError(message, error) {
  // eslint-disable-next-line no-console
  console.log(error);
  return createError(
    httpStatus.INTERNAL_SERVER_ERROR,
    `Internal error occured while ${message}`,
    { error }
  );
}

export default internalError;
