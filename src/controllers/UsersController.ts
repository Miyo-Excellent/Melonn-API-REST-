import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';
import { RoleModel, UserModel } from 'models';

export type UserUpdateType = {
  name?: String;
  phoneNumber?: String;
  lastname?: String;
  email?: String;
};

export type UsersControllerPropType = {};

export default class UsersController extends ApiMixin {
  constructor(options: UsersControllerPropType = {}) {
    super(options);
  }

  informationAboutUser: RequestHandler = async (request, response, next) => {
    try {
      const { userId = '' } = request.params;

      await this.responseSuccess({
        message: 'Information about user: Success',
        data: { userId },
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

  numberOfUsers: RequestHandler = async (request, response, next) => {
    try {
      await this.responseSuccess({
        message: 'Number of users: Success',
        data: { numberOfInvoices: 99999 },
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

  create: RequestHandler = async (request, response, next) => {
    try {
      const {
        name = '',
        phoneNumber = '',
        lastname = '',
        email = '',
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

      if (!email) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The email is required to create a new user.',
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

      const userRole = new RoleModel();

      const user = new UserModel({
        name,
        phoneNumber,
        lastname,
        email,
        roles: [userRole],
      });

      const userSaved = await user.save();

      await this.responseSuccess({
        message: 'The user was stored correctly.',
        data: userSaved,
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

  delete: RequestHandler = async (request, response, next) => {
    try {
      const { userId = '' } = request.params;

      const userDeleted = await UserModel.findByIdAndDelete(userId);

      await this.responseSuccess({
        message: 'The user was disposed of correctly.',
        data: userDeleted,
        next,
        request,
        response,
        status: 200,
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return this.responseError({
          request,
          response,
          next,
          status: 404,
          message: 'There is no user with this identifier.',
        });
      }

      await this.responseError({
        request,
        response,
        next,
        status: 500,
        message: error,
      });
    }
  };

  update: RequestHandler = async (request, response, next) => {
    try {
      const { userId = '' } = request.params;

      const {
        name = '',
        phoneNumber = '',
        lastname = '',
        email = '',
      } = request.body;

      const update: UserUpdateType = {};

      if (!!name) update.name = name;
      if (!!phoneNumber) update.phoneNumber = phoneNumber;
      if (!!lastname) update.lastname = lastname;
      if (!!email) update.email = email;

      const userUpdated = await UserModel.findByIdAndUpdate(userId, update, {
        new: true,
      });

      await this.responseSuccess({
        message: 'The user was successfully upgraded.',
        data: userUpdated,
        next,
        request,
        response,
        status: 200,
      });
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return this.responseError({
          request,
          response,
          next,
          status: 404,
          message: 'There is no user with this identifier.',
        });
      }

      return this.responseError({
        request,
        response,
        next,
        status: 500,
        message: error,
      });
    }
  };
}
