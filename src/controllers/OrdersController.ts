import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';
import { OrderModel } from 'models';

export type OrdersControllerPropType = {};

export default class OrdersController extends ApiMixin {
  constructor(options: OrdersControllerPropType = {}) {
    super(options);
  }

  numberOfOrders: RequestHandler = async (request, response, next) => {
    try {
      await this.responseSuccess({
        message: 'Number of orders: Success',
        data: { numberOfOrders: 99999 },
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

  orderingInformation: RequestHandler = async (request, response, next) => {
    try {
      const { orderId = '' } = request.params;

      await this.responseSuccess({
        message: 'Ordering information: Success',
        data: { orderId },
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

  allOrders: RequestHandler = async (request, response, next) => {
    try {
      const orders: any = await OrderModel.find();

      await this.responseSuccess({
        message: 'Ordering information: Success',
        data: orders,
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
}
