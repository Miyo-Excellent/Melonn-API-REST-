import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';

import { MelonnService } from 'services';

export type ShipmentsControllerPropType = {};

export default class ShipmentsController extends ApiMixin {
  melonnService: MelonnService = new MelonnService();

  constructor(options: ShipmentsControllerPropType = {}) {
    super(options);
  }

  informationAboutShipping: RequestHandler = async (
    request,
    response,
    next,
  ) => {
    try {
      const { shippingId = '' } = request.params;

      const shipments: [] = await this.melonnService.shippingMethodById(
        Number(shippingId),
      );

      await this.responseSuccess({
        message: 'Information about shipping: Success',
        data: shipments,
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

  numberOfShipments: RequestHandler = async (request, response, next) => {
    try {
      const shipments: [] = await this.melonnService.shippingMethods();

      await this.responseSuccess({
        message: 'Number of shipments: Success',
        data: shipments,
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

  offDays: RequestHandler = async (request, response, next) => {
    try {
      const offDaysData: [] = await this.melonnService.offDays();

      await this.responseSuccess({
        message: 'Number of shipments: Success',
        data: offDaysData,
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
