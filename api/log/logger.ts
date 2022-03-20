import winston from 'winston';
import path from 'path';

const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const;

const COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
} as const;

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

winston.addColors(COLORS);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  fileFormat,
);

const transports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(__dirname, 'error.log'),
    level: 'error',
    format: fileFormat,
  }),
  new winston.transports.File({
    filename: path.join(__dirname, 'all.log'),
    format: fileFormat,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  const consoleTransport = new winston.transports.Console({
    format: consoleFormat,
  });

  transports.push(consoleTransport);
}

const Logger = winston.createLogger({
  level: level(),
  levels: LEVELS,
  transports,
});

export default Logger;
