const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

const logDir = path.resolve(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    const msg = stack || message;
    return `${timestamp} ${level}: ${msg}`;
  })
);

const infoLogger = createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(logDir, 'info.logs'),
      level: 'info',
    }),
  ],
});

const errorLogger = createLogger({
  level: 'error',
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(logDir, 'error.logs'),
      level: 'error',
    }),
  ],
});

module.exports = { infoLogger, errorLogger, ApplicationError };