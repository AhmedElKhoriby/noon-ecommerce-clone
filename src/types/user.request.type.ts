import { Request } from 'express';
import {
  GetUsersInput,
  GetUserInput,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  CreateUserPassInput,
} from '../schemas/user.schema';

export interface IGetUsersRequest extends Request {
  query: GetUsersInput['query'] & Record<string, any>;
}

export interface IGetUserRequest extends Request {
  params: GetUserInput['params'];
}

export interface ICreateUserRequest extends Request {
  body: CreateUserInput['body'];
}

export interface IUpdateUserRequest extends Request {
  body: UpdateUserInput['body'];
  params: UpdateUserInput['params'];
}

export interface IUpdatePassUserRequest extends Request {
  body: CreateUserPassInput['body'];
  params: CreateUserPassInput['params'];
}

export interface IDeleteUserRequest extends Request {
  params: DeleteUserInput['params'];
}
