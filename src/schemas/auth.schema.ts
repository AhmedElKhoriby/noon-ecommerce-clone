import { z, object, string } from 'zod';

export const signupSchema = object({
  body: object({
    name: string({ required_error: 'User name is required.' })
      .min(2, 'User name must be at least 2 characters long.')
      .max(50, 'User name must be at most 50 characters long.'),
    email: string({ required_error: 'Email is required.' }).email('Invalid email format.'),
    password: string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
    confirmPassword: string({ required_error: 'confirmPassword is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
  })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    })
    .transform(({ confirmPassword, ...rest }) => rest),
});

export const loginSchema = object({
  body: object({
    email: string({ required_error: 'Email is required.' }).email('Invalid email format.'),
    password: string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
  }).strict(),
});

export const forgetPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required.' }).email('Invalid email format.'),
  }).strict(),
});

export const verifyPasswordSchema = object({
  body: object({
    resetCode: z.coerce
      .number({ required_error: 'resetCode is required.' })
      .int()
      .refine((val) => val.toString().length === 6, {
        message: 'Reset code must be exactly 6 digits.',
      }),
  }).strict(),
});

export const resetPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required.' }).email('Invalid email format.'),
    newPassword: string({ required_error: 'Password is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
    confirmPassword: string({ required_error: 'confirmPassword is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
  })
    .strict()
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    })
    .transform(({ confirmPassword, ...rest }) => rest),
});

export type signupInput = z.infer<typeof signupSchema>;
export type loginInput = z.infer<typeof loginSchema>;
export type forgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type verifyPasswordInput = z.infer<typeof verifyPasswordSchema>;
export type resetPasswordInput = z.infer<typeof resetPasswordSchema>;
