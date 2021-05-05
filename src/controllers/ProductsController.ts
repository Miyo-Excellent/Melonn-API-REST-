import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';

import { ProductModel } from 'models';

export type ProductsControllerPropType = {};

export type ProductUpdateType = {
  name?: String;
  quantity?: String;
  photo?: String;
  weight?: Number;
};

export default class ProductsController extends ApiMixin {
  constructor(options: ProductsControllerPropType = {}) {
    super(options);
  }

  numberOfProducts: RequestHandler = async (request, response, next) => {
    try {
      const products: any = await ProductModel.find();

      await this.responseSuccess({
        message: 'Number of products.',
        data: products,
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

  informationAboutProduct: RequestHandler = async (request, response, next) => {
    try {
      const { productId = '' } = request.params;

      const product: any = await ProductModel.findById(productId);

      await this.responseSuccess({
        message: 'Information about product.',
        data: product,
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
        quantity = '',
        photo = '',
        weight = '',
      } = request.body;

      if (!name) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The name is required to create a new product.',
        });
      }

      if (!quantity) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The quantity is required to create a new product.',
        });
      }

      if (!photo) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The photo is required to create a new product.',
        });
      }

      if (!weight) {
        return this.responseError({
          request,
          response,
          next,
          status: 400,
          message: 'The weight is required to create a new product.',
        });
      }

      const product = new ProductModel({
        name,
        photo,
        quantity,
        weight: Number(weight),
      });

      const productSaved = await product.save();

      await this.responseSuccess({
        message: 'The product was stored correctly.',
        data: productSaved,
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
            message: 'There is already a product with this name',
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
      const { productId = '' } = request.params;

      const productDeleted = await ProductModel.findByIdAndDelete(productId);

      await this.responseSuccess({
        message: 'The product was disposed of correctly.',
        data: productDeleted,
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
          message: 'There is no product with this identifier.',
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
      const { productId = '' } = request.params;

      const {
        name = '',
        quantity = '',
        photo = '',
        weight = '',
      } = request.body;

      const update: ProductUpdateType = {};

      if (!!name) update.name = name;
      if (!!quantity) update.quantity = quantity;
      if (!!photo) update.photo = photo;
      if (Number(weight) >= 0) update.weight = Number(weight);

      const productUpdated = await ProductModel.findByIdAndUpdate(
        productId,
        update,
        { new: true },
      );

      await this.responseSuccess({
        message: 'The product was successfully upgraded.',
        data: productUpdated,
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
          message: 'There is no product with this identifier.',
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
