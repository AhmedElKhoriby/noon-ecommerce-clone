import type { Application } from 'express';
import { disconnectDB } from '../config/db.config';

/**
 * Sets up shutdown signal handlers
 * @param server Server instance
 */
const setupShutdownHandlers = (server: ReturnType<Application['listen']>) => {
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n⚠️ Received ${signal}, shutting down gracefully...`);

    try {
      // Close the server
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log('✅ Server shut down.');
          resolve();
        });
      });

      // Disconnect from database
      await disconnectDB();
      console.log('✅ Database disconnected.');

      process.exitCode = 0;
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exitCode = 1;
    }
  };

  // Handle process termination signals
  process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Ctrl + C
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // Kubernetes, Docker

  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (err) => {
    console.error(`🚨 UnhandledRejection Error: ${err}`);
    await gracefulShutdown('unhandledRejection');
  });
};

export default setupShutdownHandlers;
