import AppError from './appError.js';

// export const errorCodes = {
//   unexpected: 1999,
//   notFound: 1000,
//   validation: 1001,
// } as const;

export const errors = {
  notFound: AppError.custom(404, 'Not found'),
  unexpected: AppError.custom(500, 'Something went wrong'),
} as const;
