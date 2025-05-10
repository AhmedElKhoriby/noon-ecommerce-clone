// src/server.ts
import type { Application } from 'express';
import { setupApp } from './app';
import env from './env';
import setupShutdownHandlers from './utils/shutdownHandlers';
import { connectDB } from './config/db.config';
import errorHandler from './errors/error.handler';

// Handle uncaught exceptions at the very beginning
process.on('uncaughtException', async (err) => {
  console.error(`🔥 Uncaught Exception: ${err}`);
  await errorHandler(err);
  // It's best to exit immediately on uncaught exceptions
  // as the application state may be compromised
  process.exit(1);
});

const startServer = (app: Application) => {
  const port = env.PORT;

  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  return server;
};

const main = async () => {
  try {
    // Set up Express application
    const app = await setupApp();

    // Connect to the database
    await connectDB();

    // Start the server
    const server = startServer(app);

    // Set up shutdown handlers
    setupShutdownHandlers(server);
  } catch (err) {
    console.error('Failed to start application:', err);
    await errorHandler(err);
    process.exit(1);
  }
};

// Run the application
main();
