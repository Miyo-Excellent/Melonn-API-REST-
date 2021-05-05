import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';
import { RoleModel, UserModel } from 'models';

import { RolesEnum } from 'utils';

export type AuthorizationControllerPropType = {};

export default class AuthorizationController extends ApiMixin {
  constructor(options: AuthorizationControllerPropType = {}) {
    super(options);
  }

  signIn: RequestHandler = async (request, response, next) => {
    try {
      const { email = '', password = '' } = request.body;

      if (!email) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'A email is required to log in.',
        });
      }

      if (!password) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'A password is required to log in.',
        });
      }

      const user: any = await UserModel.findOne({ email });

      if (!user) {
        return this.responseError({
          request,
          response,
          next,
          status: 404,
          message: 'No user with that email was found.',
        });
      }

      const matchPassword: boolean = await this.comparePassword(
        password,
        user.password,
      );

      if (!matchPassword) {
        return this.responseError({
          request,
          response,
          next,
          status: 401,
          message: 'Password is not valid.',
        });
      }

      const userData = {
        _id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        lastname: user.lastname,
        email: user.email,
        roles: user.roles.map(({ _id }: { _id: string }) => ({ _id })),
      };

      const token: string = await this.generateToken(userData);

      await this.responseSuccess({
        message: 'You have successfully logged in.',
        data: {
          user: userData,
          token,
        },
        next,
        request,
        response,
        status: 200,
      });
    } catch (error) {
      await this.responseError({
        request,
        response,
        next,
        status: 500,
        message: error,
      });
    }
  };

  signUp: RequestHandler = async (request, response, next) => {
    try {
      const {
        name = '',
        phoneNumber = '',
        lastname = '',
        email = '',
        password = '',
      } = request.body;

      if (!name) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The name is required to create a new user.',
        });
      }

      if (!phoneNumber) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The phoneNumber is required to create a new user.',
        });
      }

      if (!lastname) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The lastname is required to create a new user.',
        });
      }

      if (!email) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The email is required to create a new user.',
        });
      }

      if (!password) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The password is required to create a new user.',
        });
      }

      const userRole = await RoleModel.findOne({ name: RolesEnum.USER });

      const encryptedPassword = await this.encryptPassword(password);

      const user: any = await new UserModel({
        name,
        phoneNumber,
        lastname,
        email,
        password: encryptedPassword,
        roles: [userRole],
      });

      const userSaved = await user.save();

      const userData = {
        _id: userSaved._id,
        name: userSaved.name,
        phoneNumber: userSaved.phoneNumber,
        lastname: userSaved.lastname,
        email: userSaved.email,
        roles: userSaved.roles.map(({ _id }: { _id: string }) => ({ _id })),
      };

      const token: string = await this.generateToken(userData);

      await this.responseSuccess({
        message: 'Information about authorization',
        data: {
          user: userData,
          token,
        },
        next,
        request,
        response,
        status: 200,
      });
    } catch (error) {
      switch (error.code) {
        case 11000:
          return this.responseError({
            request,
            response,
            next,
            status: 409,
            message: 'There is already a user with this name',
          });

        default:
          return this.responseError({
            request,
            response,
            next,
            status: 500,
            message: error,
          });
      }
    }
  };
}
