/* eslint-disable no-console */
import debug from 'debug';
import http from 'http';
import app from './app';

const appDebug = debug('app');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3030');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
// server.listen(); // server uses own port
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const iPort = parseInt(val, 10);

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(iPort)) {
    // named pipe
    return val;
  }

  if (iPort >= 0) {
    // port number
    return iPort;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  appDebug(`Listening on ${bind}`);
}
