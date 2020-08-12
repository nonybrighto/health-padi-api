/* eslint-disable no-console */
import createHttpError from 'http-errors';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import passport from 'passport';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import RateLimit from 'express-rate-limit';
import config from './config/config';
import router from './app/routes/index.route';
import configurePassport from './config/passport';

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

morgan.token('hostError', (req, _res) => {
  return req.stackError || 'none';
});
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms \n :hostError',
    {
      stream: fs.createWriteStream(path.join(__dirname, '../morgan.log'), {
        flags: 'a+'
      }),
      skip(req, res) {
        return res.statusCode < 400;
      }
    }
  )
);
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      callback(null, true);
    }
  })
);

app.use(passport.initialize());
configurePassport();

const apiLimiter = new RateLimit({
  windowMs: 5 * 60 * 1000,
  max: config.get('NODE_ENV') === 'test' ? 10000 : 100,
  message: 'Too many requests. Please try again later.'
});

app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

// api route
app.use('/api/v1', router);

expressValidation.options({
  status: httpStatus.UNPROCESSABLE_ENTITY,
  statusText: 'Unprocessable Entity'
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return next(createHttpError(httpStatus.NOT_FOUND, 'API URI not found'));
});

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join('. '))
      .join(' and ');
    return next(createHttpError(err.status, unifiedErrorMessage));
  }
  return next(err);
});

app.use((err, req, res, _) => {
  const responseBody = {};
  req.stackError = '';
  responseBody.message = err.message;
  if (!err.status) {
    err.status = 500;
    responseBody.message = 'An unknown error occured internally. Contact Admin';
    // This happens if an error occurs where it is not caught. Rare situation.
  }

  const errorStack = err.status >= 500 ? err.error.stack : err.stack;
  if (config.get('NODE_ENV') === 'development') {
    responseBody.stack = errorStack;
  }
  if (errorStack) {
    req.stackError = errorStack;
  }
  return res.status(err.status).json(responseBody);
});

export default app;
