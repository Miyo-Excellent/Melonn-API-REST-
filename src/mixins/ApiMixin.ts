import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import moment from 'moment';
import config from 'config';
import { compare, genSalt, hash } from 'bcrypt';

export type ApiMixinPropType = {};

export type ResponseSuccessPropType = {
  request: Request;
  response: Response;
  next: NextFunction;
  data: any;
  message: string;
  status: number;
};

export type ResponseErrorPropType = {
  request: Request;
  response: Response;
  next: NextFunction;
  message: string;
  status: number;
};

export type ApiMixinResponseSuccessPropTypes = (
  options: ResponseSuccessPropType,
) => Promise<void>;

export type ApiMixinResponseErrorPropTypes = (
  options: ResponseErrorPropType,
) => Promise<void>;

export type ApiMixinComparePasswordPropTypes = (
  password: string,
  receivedPassword: string,
) => Promise<boolean>;

export type GenerateTokenPropTypes = (data: any) => Promise<string>;

export type EncryptPasswordPropTypes = (password: string) => Promise<string>;

export default class ApiMixin {
  constructor({}: ApiMixinPropType = {}) {}

  protected generateToken: GenerateTokenPropTypes = async (data) =>
    sign(data, config.keys.jwtSecret, {
      expiresIn: moment().add(1, 'month').unix(),
    });

  protected comparePassword: ApiMixinComparePasswordPropTypes = async (
    password,
    receivedPassword,
  ) => compare(password, receivedPassword);

  protected encryptPassword: EncryptPasswordPropTypes = async (password) => {
    const salt = await genSalt(10);

    return hash(password, salt);
  };
  protected responseSuccess: ApiMixinResponseSuccessPropTypes = async ({
    request,
    response,
    next,
    message,
    data,
    status = 200,
  }): Promise<void> => {
    response.statusCode = status;

    response
      .status(status)
      .json({
        message,
        data,
      })
      .end();
  };

  protected responseError: ApiMixinResponseErrorPropTypes = async ({
    request,
    response,
    next,
    message,
    status = 500,
  }): Promise<void> => {
    response.statusCode = status;

    response
      .status(status)
      .json({
        message,
      })
      .end();
  };
}
