import 'dotenv/config'; // = require('dotenv').config();
import { z } from 'zod';
import ms from 'ms';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url(),
  SALT_ROUNDS: z.coerce.number().default(12),
  JWT_SECRET_KEY: z.string(),
  JWT_EXPIRE_TIME: z.string().transform((value) => value as ms.StringValue),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});
const env = envSchema.parse(process.env);
export default env;

export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
export const isProd = env.NODE_ENV === 'production';
