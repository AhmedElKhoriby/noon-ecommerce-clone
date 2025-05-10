import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import env from '../env';
import slugify from 'slugify';

const passwordMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.model === 'User' && (params.action === 'create' || params.action === 'update')) {
    const userData = params.args.data;

    if (userData.password) {
      const salt = await bcrypt.genSalt(env.SALT_ROUNDS);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
  }
  return next(params);
};

const slugMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.action === 'create' || params.action === 'update') {
    const data = params.args.data;

    if (data.name) {
      data.slug = slugify(data.name, { lower: true });
    }
  }
  return next(params);
};

const logMiddleware: Prisma.Middleware = async (params, next) => {
  console.log(`[Prisma Middleware] Model: ${params.model}, Action: ${params.action}`);
  return next(params);
};

/*
import { PrismaClient, Brand } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);

  // ✅ تعديل البيانات بعد استرجاعها فقط (Post-Middleware)
  if (params.model === "Brand" && ["findUnique", "findMany", "findFirst", "update"].includes(params.action)) {
    if (Array.isArray(result)) {
      result.forEach(setImageURL);
    } else if (result) {
      setImageURL(result);
    }
  }

  return result;
});

// ✅ دالة لإضافة رابط الصورة قبل إرساله للـ Frontend
const setImageURL = (brand: Brand) => {
  if (brand.image) {
    brand.image = `${process.env.BASE_URL}/brands/${brand.image}`;
  }
};

export default prisma;

*/

const middlewares: Prisma.Middleware[] = [passwordMiddleware, logMiddleware, slugMiddleware];

export default middlewares;
