import { RequestHandler } from 'express';

import { ApiMixin } from 'mixins';

export type InvoicesControllerPropType = {};

export default class InvoicesController extends ApiMixin {
  constructor({}: InvoicesControllerPropType = {}) {
    super();
  }

  numberOfInvoices: RequestHandler = async (request, response, next) => {
    try {
      await this.responseSuccess({
        message: 'Number of invoice: Success',
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

  informationAboutInvoice: RequestHandler = async (request, response, next) => {
    try {
      const { invoiceId = '' } = request.params;

      await this.responseSuccess({
        message: 'Information about invoice: Success',
        data: { invoiceId },
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
