import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import requestLogger from './logger.middleware';
import env from '../env';
import path from 'path';

export const setupMiddlewares = (app: express.Application) => {
  setupSecurity(app);
  setupParsers(app);
  setupLogging(app);
  setupStaticFiles(app);
};

const setupSecurity = (app: express.Application) => {
  app.enable('trust proxy');
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.use(
    cors({
      origin: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.use(hpp());
};

const setupParsers = (app: express.Application) => {
  app.use(express.json()); // Parse JSON requests
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
};

const setupLogging = (app: express.Application) => {
  console.log(`mode: ${env.NODE_ENV}`);
  app.use(requestLogger);
};

const setupStaticFiles = (app: express.Application) => {
  app.use(express.static(path.join(__dirname, '..', '..', 'uploads')));
};

/*
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import requestLogger from './logger.middleware';
import env from '../env';

export const setupMiddlewares = (app: express.Application) => {
  setupSecurity(app);
  setupParsers(app);
  setupLogging(app);
  setupPerformance(app);
  setupRateLimiting(app);
  setupCookies(app);
};

const setupSecurity = (app: express.Application) => {
  app.enable('trust proxy');
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );

  const allowedOrigins = env.NODE_ENV === 'production' ? ['https://yourdomain.com'] : true;
  app.use(
    cors({
      origin: allowedOrigins,
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  app.use(hpp());
};

const setupParsers = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
};

const setupLogging = (app: express.Application) => {
  console.log(`mode: ${env.NODE_ENV}`);
  app.use(requestLogger);
};

const setupPerformance = (app: express.Application) => {
  app.use(compression());
};

const setupRateLimiting = (app: express.Application) => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  });

  app.use(limiter);
};

const setupCookies = (app: express.Application) => {
  app.use(cookieParser());
};

*/
