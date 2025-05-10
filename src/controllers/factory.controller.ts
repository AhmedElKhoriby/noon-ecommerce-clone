import { PrismaClient, Prisma } from '@prisma/client';

class CrudService<U extends Prisma.ModelName> {
  protected prisma: PrismaClient;
  protected model: U;

  constructor(model: U) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  async findAll() {
    return (this.prisma[this.model as keyof PrismaClient] as any).findMany();
  }

  async findOne(id: number) {
    return (this.prisma[this.model as keyof PrismaClient] as any).findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return (this.prisma[this.model as keyof PrismaClient] as any).create({ data });
  }

  async update(id: number, data: any) {
    return (this.prisma[this.model as keyof PrismaClient] as any).update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return (this.prisma[this.model as keyof PrismaClient] as any).delete({
      where: { id },
    });
  }
}

import { Request, Response, NextFunction } from 'express';

class CrudController<T extends CrudService<any>> {
  protected service: T;

  constructor(service: T) {
    this.service = service;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.findAll();
      res.status(200).json({ results: data.length, data });
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.findOne(id);
      if (!data) return res.status(404).json({ message: 'Not found' });
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const data = await this.service.update(id, req.body);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

class ProductService extends CrudService<'Product'> {
  constructor() {
    super('Product');
  }
}

const productService = new ProductService();
export const productController = new CrudController(productService);

import express from 'express';

const router = express.Router();

router.get('/', productController.getAll);
// router.get("/:id", productController.getOne);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

// import { Request, Response, NextFunction } from 'express';
// import { Prisma, PrismaClient } from '@prisma/client';

// type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// // تعريف نوع الـ query للـ Prisma
// type PrismaQuery = {
//   where?: Record<string, any>;
//   skip?: number;
//   take?: number;
//   orderBy?: Record<string, 'asc' | 'desc'>;
//   select?: Record<string, boolean>;
// };

// // Async handler wrapper
// const catchError = (fn: AsyncFunction) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

// // تعريف نوع الخطأ المخصص
// class AppError extends Error {
//   statusCode: number;
//   status: string;

//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//   }
// }

// const prisma = new PrismaClient();

// // واجهة تحدد الدوال التي نستخدمها من Prisma
// interface PrismaModelDelegate<T> {
//   create: (args: { data: any }) => Promise<T>;
//   findUnique: (args: { where: { id: number } }) => Promise<T | null>;
//   findMany: (args?: any) => Promise<T[]>;
//   update: (args: { where: { id: number }; data: any }) => Promise<T>;
//   delete: (args: { where: { id: number } }) => Promise<T>;
//   count: (args?: any) => Promise<number>;
// }

// // نوع للنماذج في Prisma
// type PrismaModel = keyof typeof prisma;

// // دالة مساعدة للتعامل مع الأخطاء وإرجاع الاستجابة
// const handleResponse = <T>(
//   res: Response,
//   data: T,
//   message?: string,
//   statusCode: number = 200
// ) => {
//   res.status(statusCode).json({ data, message });
// };

// // دالة مساعدة للتحقق من وجود المستند وإرجاع خطأ إذا لم يكن موجودًا
// const checkDocumentExists = <T>(doc: T | null, next: NextFunction) => {
//   if (!doc) return next(new AppError('No document found with this id', 404));
// };

// export const createEntity = <T>(model: PrismaModel, modelName?: string) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const delegate = prisma[model] as unknown as PrismaModelDelegate<T>; // التحويل إلى unknown أولاً
//     const doc = await delegate.create({ data: req.body });
//     handleResponse(res, { doc }, `${modelName} created successfully`);
//   });

// export const getEntity = <T>(model: PrismaModel) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const delegate = prisma[model] as unknown as PrismaModelDelegate<T>; // التحويل إلى unknown أولاً
//     const doc = await delegate.findUnique({ where: { id: Number(id) } });
//     checkDocumentExists(doc, next);
//     handleResponse(res, { doc });
//   });

// export const getAllEntity = <T>(model: PrismaModel) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const { limit = 10, page = 1, sort, filter, fields } = req.query;

//     const skip = (Number(page) - 1) * Number(limit);
//     const take = Number(limit);

//     const where = filter ? JSON.parse(filter as string) : {};
//     const orderBy = sort ? JSON.parse(sort as string) : undefined;
//     const select = fields ? JSON.parse(fields as string) : undefined;

//     const delegate = prisma[model] as unknown as PrismaModelDelegate<T>; // التحويل إلى unknown أولاً
//     const docs = await delegate.findMany({
//       where,
//       orderBy,
//       select,
//       skip,
//       take,
//     });

//     const totalCount = await delegate.count({ where });
//     const totalPages = Math.ceil(totalCount / Number(limit));

//     handleResponse(res, { docs, totalPages });
//   });

// export const updateEntity = <T>(model: PrismaModel) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const delegate = prisma[model] as unknown as PrismaModelDelegate<T>; // التحويل إلى unknown أولاً
//     const doc = await delegate.update({
//       where: { id: Number(id) },
//       data: req.body,
//     });
//     checkDocumentExists(doc, next);
//     handleResponse(res, { doc });
//   });

// export const deleteEntity = <T>(model: PrismaModel) =>
//   catchError(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const delegate = prisma[model] as unknown as PrismaModelDelegate<T>; // التحويل إلى unknown أولاً
//     const doc = await delegate.delete({ where: { id: Number(id) } });
//     checkDocumentExists(doc, next);
//     handleResponse(res, null, 'successfully deleted');
//   });
// /
// import { Request, Response, NextFunction } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // تعريف نوع الخطأ المخصص
// class ApiError extends Error {
//   statusCode: number;
//   status: string;

//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//   }
// }

// // تعريف نوع النتيجة المترتبة على التقسيم (Pagination)
// interface PaginationResult {
//   currentPage: number;
//   numberOfPages: number;
//   limit: number;
//   total: number;
//   next?: number;
//   prev?: number;
// }

// // تعريف نوع الاستجابة العامة للـ API
// interface ApiResponse<T> {
//   results?: number;
//   paginationResult?: PaginationResult;
//   data: T;
// }

// // تعريف نوع الدالة الـ async handler
// type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// // تعريف نوع الـ query للـ Prisma
// type PrismaQuery = {
//   where?: Record<string, any>;
//   skip?: number;
//   take?: number;
//   orderBy?: Record<string, 'asc' | 'desc'>;
//   select?: Record<string, boolean>;
// };

// // Async handler wrapper
// const asyncHandler = (fn: AsyncFunction) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

// // فئة ApiFeatures لبناء الاستعلامات
// class ApiFeatures<T> {
//   query: PrismaQuery;
//   queryString: Record<string, any>;
//   paginationResult?: PaginationResult;

//   constructor(query: PrismaQuery, queryString: Record<string, any>) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   paginate(total: number): this {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 50;
//     const skip = (page - 1) * limit;

//     const numberOfPages = Math.ceil(total / limit);

//     this.paginationResult = {
//       currentPage: page,
//       numberOfPages,
//       limit,
//       total,
//       next: page < numberOfPages ? page + 1 : undefined,
//       prev: page > 1 ? page - 1 : undefined,
//     };

//     this.query = {
//       ...this.query,
//       skip,
//       take: limit,
//     };

//     return this;
//   }

//   filter(): this {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
//     excludedFields.forEach((field) => delete queryObj[field]);

//     const where: Record<string, any> = {};
//     Object.entries(queryObj).forEach(([key, value]) => {
//       if (typeof value === 'object') {
//         const conditions: Record<string, any> = {};
//         Object.entries(value as object).forEach(([operator, val]) => {
//           switch (operator) {
//             case '$gte':
//               conditions.gte = val;
//               break;
//             case '$gt':
//               conditions.gt = val;
//               break;
//             case '$lte':
//               conditions.lte = val;
//               break;
//             case '$lt':
//               conditions.lt = val;
//               break;
//             case '$eq':
//               conditions.equals = val;
//               break;
//             case '$ne':
//               conditions.not = val;
//               break;
//             case '$in':
//               conditions.in = val;
//               break;
//           }
//         });
//         where[key] = conditions;
//       } else {
//         where[key] = { equals: value };
//       }
//     });

//     this.query = {
//       ...this.query,
//       where: {
//         ...this.query.where,
//         ...where,
//       },
//     };

//     return this;
//   }

//   sort(): this {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort
//         .split(',')
//         .reduce((acc: Record<string, 'asc' | 'desc'>, field: string) => {
//           const order = field.startsWith('-') ? 'desc' : 'asc';
//           const cleanField = field.replace('-', '');
//           acc[cleanField] = order;
//           return acc;
//         }, {});

//       this.query = {
//         ...this.query,
//         orderBy: sortBy,
//       };
//     }
//     return this;
//   }

//   limitFields(): this {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields
//         .split(',')
//         .reduce((acc: Record<string, boolean>, field: string) => {
//           acc[field] = true;
//           return acc;
//         }, {});

//       this.query = {
//         ...this.query,
//         select: fields,
//       };
//     }
//     return this;
//   }

//   search(modelName: string): this {
//     if (this.queryString.keyword) {
//       const searchQuery = {
//         OR: [
//           { name: { contains: this.queryString.keyword, mode: 'insensitive' } },
//           { description: { contains: this.queryString.keyword, mode: 'insensitive' } },
//         ],
//       };

//       this.query = {
//         ...this.query,
//         where: {
//           ...this.query.where,
//           ...searchQuery,
//         },
//       };
//     }
//     return this;
//   }
// }

// // Factory handlers
// export const deleteOne = <T>(model: keyof PrismaClient) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const document = await (prisma[model] as any).delete({
//       where: { id: Number(id) },
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${id}`, 404));
//     }

//     res.status(204).send();
//   });

// export const updateOne = <T>(model: keyof PrismaClient) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const document = await (prisma[model] as any).update({
//       where: { id: Number(req.params.id) },
//       data: req.body,
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });

// export const createOne = <T>(model: keyof PrismaClient) =>
//   asyncHandler(async (req: Request, res: Response) => {
//     const document = await (prisma[model] as any).create({
//       data: req.body,
//     });

//     res.status(201).json({ data: document });
//   });

// export const getOne = <T>(model: keyof PrismaClient) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const document = await (prisma[model] as any).findUnique({
//       where: { id: Number(id) },
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });

// export const getAll = <T>(model: keyof PrismaClient, modelName = '') =>
//   asyncHandler(async (req: Request, res: Response) => {
//     let filter = {};
//     if ((req as any).filterObj) {
//       filter = (req as any).filterObj;
//     }

//     const total = await (prisma[model] as any).count({
//       where: filter,
//     });

//     const features = new ApiFeatures<T>({ where: filter }, req.query)
//       .paginate(total)
//       .filter()
//       .search(modelName)
//       .limitFields()
//       .sort();

//     const documents = await (prisma[model] as any).findMany(features.query);

//     res.status(200).json({
//       results: documents.length,
//       paginationResult: features.paginationResult,
//       data: documents,
//     });
//   });

// // إضافة تعريفات عامة (Global Declarations)
// declare global {
//   namespace Express {
//     interface Request {
//       filterObj?: Record<string, any>;
//     }
//   }
// }

// export {};

// import { Request, Response, NextFunction } from 'express';
// import { Prisma, PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// class ApiError extends Error {
//   statusCode: number;
//   status: string;

//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//     this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//   }
// }

// // Types for pagination
// interface PaginationResult {
//   currentPage: number;
//   numberOfPages: number;
//   limit: number;
//   total: number;
//   next?: number;
//   prev?: number;
// }

// // Types for API response
// interface ApiResponse<T> {
//   results?: number;
//   paginationResult?: PaginationResult;
//   data: T;
// }

// // Async handler wrapper
// const asyncHandler = (fn: Function) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };

// // API Features class for query building
// class ApiFeatures {
//   query: any;
//   queryString: any;
//   paginationResult?: PaginationResult;

//   constructor(query: any, queryString: any) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   paginate(total: number) {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 50;
//     const skip = (page - 1) * limit;

//     const numberOfPages = Math.ceil(total / limit);

//     this.paginationResult = {
//       currentPage: page,
//       numberOfPages,
//       limit,
//       total,
//       next: page < numberOfPages ? page + 1 : undefined,
//       prev: page > 1 ? page - 1 : undefined,
//     };

//     this.query = {
//       ...this.query,
//       skip,
//       take: limit,
//     };

//     return this;
//   }

//   filter() {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
//     excludedFields.forEach((field) => delete queryObj[field]);

//     // Convert query to Prisma format
//     const where: any = {};
//     Object.entries(queryObj).forEach(([key, value]) => {
//       if (typeof value === 'object') {
//         const conditions: any = {};
//         Object.entries(value as object).forEach(([operator, val]) => {
//           switch (operator) {
//             case '$gte':
//               conditions.gte = val;
//               break;
//             case '$gt':
//               conditions.gt = val;
//               break;
//             case '$lte':
//               conditions.lte = val;
//               break;
//             case '$lt':
//               conditions.lt = val;
//               break;
//             case '$eq':
//               conditions.equals = val;
//               break;
//             case '$ne':
//               conditions.not = val;
//               break;
//             case '$in':
//               conditions.in = val;
//               break;
//           }
//         });
//         where[key] = conditions;
//       } else {
//         where[key] = { equals: value };
//       }
//     });

//     this.query = {
//       ...this.query,
//       where: {
//         ...this.query.where,
//         ...where,
//       },
//     };

//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort
//         .split(',')
//         .reduce((acc: any, field: string) => {
//           const order = field.startsWith('-') ? 'desc' : 'asc';
//           const cleanField = field.replace('-', '');
//           acc[cleanField] = order;
//           return acc;
//         }, {});

//       this.query = {
//         ...this.query,
//         orderBy: sortBy,
//       };
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields
//         .split(',')
//         .reduce((acc: any, field: string) => {
//           acc[field] = true;
//           return acc;
//         }, {});

//       this.query = {
//         ...this.query,
//         select: fields,
//       };
//     }
//     return this;
//   }

//   search(modelName: string) {
//     if (this.queryString.keyword) {
//       const searchQuery = {
//         OR: [
//           { name: { contains: this.queryString.keyword, mode: 'insensitive' } },
//           { description: { contains: this.queryString.keyword, mode: 'insensitive' } },
//         ],
//       };

//       this.query = {
//         ...this.query,
//         where: {
//           ...this.query.where,
//           ...searchQuery,
//         },
//       };
//     }
//     return this;
//   }
// }

// // Factory handlers
// export const deleteOne = (model: string) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const document = await (prisma as any)[model].delete({
//       where: { id: Number(id) },
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${id}`, 404));
//     }

//     res.status(204).send();
//   });

// export const updateOne = (model: string) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const document = await (prisma as any)[model].update({
//       where: { id: Number(req.params.id) },
//       data: req.body,
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${req.params.id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });

// export const createOne = (model: string) =>
//   asyncHandler(async (req: Request, res: Response) => {
//     const document = await (prisma as any)[model].create({
//       data: req.body,
//     });

//     res.status(201).json({ data: document });
//   });

// export const getOne = (model: string) =>
//   asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const document = await (prisma as any)[model].findUnique({
//       where: { id: Number(id) },
//     });

//     if (!document) {
//       return next(new ApiError(`No document found with id ${id}`, 404));
//     }

//     res.status(200).json({ data: document });
//   });

// export const getAll = (model: string, modelName = '') =>
//   asyncHandler(async (req: Request, res: Response) => {
//     let filter = {};
//     if ((req as any).filterObj) {
//       filter = (req as any).filterObj;
//     }

//     const total = await (prisma as any)[model].count({
//       where: filter,
//     });

//     const features = new ApiFeatures({ where: filter }, req.query)
//       .paginate(total)
//       .filter()
//       .search(modelName)
//       .limitFields()
//       .sort();

//     const documents = await (prisma as any)[model].findMany(features.query);

//     res.status(200).json({
//       results: documents.length,
//       paginationResult: features.paginationResult,
//       data: documents,
//     });
//   });

// // import { catchAsync } from '../utils/catchAsync';

// // const createEntity = (Model: prisma) =>
// //   catchAsync(async (req: CreateCategoryRequest, res: Response): Promise<void> => {
// //     const category = req.body;

// //     const newCategory = await categoryService.createCategory(category);

// //     res.status(201).json(newCategory);
// //   });
