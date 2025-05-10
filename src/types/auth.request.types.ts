import { Request } from 'express';
import {
  signupInput,
  loginInput,
  forgetPasswordInput,
  verifyPasswordInput,
  resetPasswordInput,
} from '../schemas/auth.schema';
import type { User } from '@prisma/client';

export interface ISignupRequest extends Request {
  body: signupInput['body'];
}

export interface ILoginRequest extends Request {
  body: loginInput['body'];
}

export interface IForgetPasswordRequest extends Request {
  body: forgetPasswordInput['body'];
}

export interface IVerifyPasswordRequest extends Request {
  body: verifyPasswordInput['body'];
}

export interface IResetPasswordRequest extends Request {
  body: resetPasswordInput['body'];
}

export interface IProtectRequest extends Request {
  user: User;
}
