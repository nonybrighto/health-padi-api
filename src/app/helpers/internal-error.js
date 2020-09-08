import createError from 'http-errors';
import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';

function internalError(message, error) {
  console.log(error);
  const dateString = new Date().toString();
  fs.appendFile(
    path.join(__dirname, '../../../morgan.log'),
    `~~~~~\n 
    Internal error occured while ${message} - ${dateString}\n 
    ${error} - ${error.stack}\n~~~~~~~\n`,
    err => {
      if (err) {
        console.log('error occured while adding');
      }
    }
  );
  return createError(
    httpStatus.INTERNAL_SERVER_ERROR,
    `Internal error occured while ${message}`,
    { error }
  );
}

export default internalError;
