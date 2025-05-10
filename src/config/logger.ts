// import pino from 'pino';
// import path from 'path';
// import { isDev } from '../env';

// const LOG_DIR = path.join(__dirname, 'logs');

// const logger = pino(
//   {
//     level: isDev ? 'debug' : 'info',
//     timestamp: pino.stdTimeFunctions.isoTime,
//     messageKey: 'msg',
//   },
//   pino.transport({
//     targets: [
//       { target: 'pino-pretty', options: { colorize: true } },
//       {
//         target: 'pino/file',
//         options: { destination: path.join(LOG_DIR, 'app.log'), mkdir: true, interval: '1d' },
//       },
//       {
//         target: 'pino/file',
//         options: { destination: path.join(LOG_DIR, 'errors.log'), mkdir: true, level: 'error', interval: '1d' },
//       },
//     ],
//   })
// );

// export default logger;
