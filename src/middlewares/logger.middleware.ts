import { ServerResponse } from 'node:http';
import { RequestHandler } from 'express';
import { LevelWithSilent } from 'pino';
import dayjs from 'dayjs';
import logger from '../utils/logger';
import { isDev } from '../env';

enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}

const customLogLevel = (res: ServerResponse, err?: Error): LevelWithSilent => {
  if (err || res.statusCode >= 500) return LogLevel.Error;
  if (res.statusCode >= 400) return LogLevel.Warn;
  if (res.statusCode >= 300) return LogLevel.Silent;
  return LogLevel.Info;
};

const requestLogger: RequestHandler = (req, res, next) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

    const level = customLogLevel(res);
    if (level === LogLevel.Silent) return;

    const formattedTime = dayjs().format('DD/MMM/YYYY:HH:mm:ss ZZ');

    const remoteAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-';

    const contentLength = res.getHeader('content-length') || 0;

    if (isDev) {
      logger[level](`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    } else {
      logger[level](
        `${remoteAddr} - - [${formattedTime}] "${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${
          res.statusCode
        } ${contentLength} "${req.headers.referer || '-'}" "${req.headers['user-agent'] || '-'}" (${duration}ms)`
      );
    }
  });

  next();
};

export default requestLogger;
