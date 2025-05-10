import { PrismaClient, Category } from '@prisma/client';
import middlewares from '../middlewares/prisma.middleware';
import env from '../env';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient({ errorFormat: 'pretty' });
}

db = global.__db;

export const connectDB = async () => {
  try {
    await db.$connect();
    console.log('Database Connected Successfully');
  } catch (error) {
    console.error(`Database Error: ${error}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await db.$disconnect();
    console.log('Database disconnected Successfully');
  } catch (error) {
    console.error(`Database Error: ${error}`);
    process.exit(1);
  }
};

middlewares.forEach((middleware) => db.$use(middleware));

export default db;
