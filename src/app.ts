import express from 'express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { setupErrorHandlers } from './middlewares/error.middleware';

export const setupApp = async () => {
  const app = express();

  // This code adds a new function (`toJSON`) to `BigInt.prototype`, so it is automatically called whenever an object containing a BigInt is converted to JSON using `JSON.stringify()`.
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  // Initialize all components
  setupMiddlewares(app);
  setupRoutes(app);
  setupErrorHandlers(app);

  return app;
};

export default setupApp;
