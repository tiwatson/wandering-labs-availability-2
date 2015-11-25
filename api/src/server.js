import app from './app'

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import requestLogger from 'bunyan-request';
import 'source-map-support/register';
import swaggerize from 'swaggerize-express';

import http from 'http';
import bunyan from 'bunyan';

const logger = bunyan.createLogger({ name: 'availability-api', level: 'debug' });
const serverApp = express();

serverApp.use(bodyParser.json());
serverApp.use(cors());
serverApp.use(requestLogger({ logger, headerName: 'x-request-id' }));

class Context {
  constructor(response) {
    this.response = response;
  }

  success(obj) {
    this.response.status(200).json(obj).end();
  }
}

const handlers = {
  'availability_requests': {
    '$post': function(req, res) {
      app.availabilityRequestCreate(req.body, new Context(res));
    }
  }
}

serverApp.use(swaggerize({
  api: path.resolve(__dirname, '../config/swagger.yaml'),
  handlers: handlers,
}));


function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort('3000');
serverApp.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    logger.error(bind + ' requires elevated privileges');
    process.exit(1);
    break;
  case 'EADDRINUSE':
    logger.error(bind + ' is already in use');
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Create HTTP server.
 */

const server = http.createServer(serverApp);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  logger.info('Listening on ' + bind);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
