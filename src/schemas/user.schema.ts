import { z, object, string, nativeEnum } from 'zod';

// Enum for role validation
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

const egyptianPhoneRegex = /^\+20\d{10}$/;

const baseUserSchema = object({
  name: string({ required_error: 'User name is required.' })
    .min(2, 'User name must be at least 2 characters long.')
    .max(50, 'User name must be at most 50 characters long.'),
  email: string({ required_error: 'Email is required.' }).email('Invalid email format.'),
  phone: string()
    .regex(egyptianPhoneRegex, 'Invalid Egyptian phone number format. Must start with +20 and contain 11 digits.')
    .optional(),
  profileImg: string().optional(),
  role: nativeEnum(Role).default(Role.USER).optional(),
});

export const createUserSchema = object({
  body: baseUserSchema
    .merge(
      object({
        password: string({ required_error: 'Password is required.' })
          .min(8, 'Password must be at least 8 characters long.')
          .max(64, 'Password must be at most 64 characters long.'),
        confirmPassword: string({ required_error: 'confirmPassword is required.' })
          .min(8, 'Password must be at least 8 characters long.')
          .max(64, 'Password must be at most 64 characters long.'),
      })
    )
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    })
    .transform(({ confirmPassword, ...rest }) => rest),
});

export const updateUserSchema = object({
  body: baseUserSchema.partial().strict(),

  params: object({
    id: string({ required_error: 'User ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
});

export const updateUserPassSchema = object({
  body: object({
    currentPassword: string({ required_error: 'currentPassword is required.' })
      .min(8, 'Password must be at least 8 characters long.')
      .max(64, 'Password must be at most 64 characters long.'),
    newPassword: string({ required_error: 'newPassword is required.' })
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

  params: object({
    id: string({ required_error: 'User ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
});

export const getUsersSchema = object({
  query: object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).default(10).optional(),
  }).strict(),
});

const params = {
  params: object({
    id: string({ required_error: 'User ID is required.' }).uuid('Invalid UUID format.'),
  }).strict(),
};

export const getUserSchema = object({ ...params });
export const deleteUserSchema = object({ ...params });

export type GetUsersInput = z.infer<typeof getUsersSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserPassInput = z.infer<typeof updateUserPassSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
