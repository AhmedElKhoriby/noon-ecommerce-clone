import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validation =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsedData.body;
      req.query = parsedData.query;
      req.params = parsedData.params;

      next();
    } catch (error) {
      // error to handle
      next(error);
    }
  };

export default validation;
