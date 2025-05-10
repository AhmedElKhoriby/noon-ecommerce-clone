import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      // file?: Express.Multer.File;
    }
  }
}

export {};

// لا تنسَ هذا السطر - مهم لإخبار TypeScript أن هذا ملف وحدة
/*

import type { ContainerInterface } from '@/shared/container';
import type { DurationTimeInterface } from '@/shared/duration-time';
import type { JwtVerifyOutput } from '@/shared/jwt';

declare global {
  export namespace Express {
    export interface Request {
      jwt: JwtVerifyOutput;
      container: ContainerInterface;
      durationTime: DurationTimeInterface;
      originalMethod?: string;
      authorizationToken: string;
      skipRequestLog: boolean;
      awsRequestId: string;
      awsTraceId: string;
      acceptLanguage: string;
      requestId: string;
    }
  }
}

*/
