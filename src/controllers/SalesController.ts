import { RequestHandler } from 'express';
import moment, { Moment } from 'moment';
import { findIndex, isEmpty } from 'lodash';

import { ApiMixin } from 'mixins';
import {
  MelonnService,
  MelonnServiceValidateBasedOnWeightRulesTypes,
} from 'services';
import { PackPromiseMinTypeEnum } from '../utils/enums';

export type SalesControllerPropType = {};

export default class SalesController extends ApiMixin {
  melonnService: MelonnService = new MelonnService();

  constructor(options: SalesControllerPropType = {}) {
    super(options);
  }

  numberOfSales: RequestHandler = async (request, response, next) => {
    try {
      await this.responseSuccess({
        message: 'Number of sales: Success',
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

  informationAboutSale: RequestHandler = async (request, response, next) => {
    try {
      const { salesId = '' } = request.params;

      await this.responseSuccess({
        message: 'Information about sale: Success',
        data: { salesId },
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

  generateSale: RequestHandler = async (request, response, next) => {
    try {
      const { shippingId = '' } = request.params;

      const { products = [] } = request.body;

      const today: Moment = moment();

      const hour: number = Number(today.format('HH'));

      const dataFailed: any = {
        packPromiseMin: null,
        packPromiseMax: null,
        shipPromiseMin: null,
        shipPromiseMax: null,
        deliveryPromiseMin: null,
        deliveryPromiseMax: null,
        readyPromiseMin: null,
        readyPromiseMax: null,
      };

      let priority: number = 1;

      let SelectedPromiseCase: any = null;

      if (!products || !Array.isArray(products)) {
        return this.responseError({
          message: 'The list of products to have at least one item.',
          next,
          request,
          response,
          status: 400,
        });
      }

      const weightOfProducts: number = products.reduce(
        (acc: number, { weight = '0' }: any) => acc + Number(weight),
        0,
      );

      if (!shippingId) {
        return this.responseError({
          message: 'A shipment identifier is required.',
          next,
          request,
          response,
          status: 400,
        });
      }

      const shipping: MelonnServiceValidateBasedOnWeightRulesTypes = await this.melonnService.shippingMethodById(
        Number(shippingId),
      );

      if (!shipping) {
        return this.responseError({
          message: 'The selected shipping method does not exist.',
          next,
          request,
          response,
          status: 400,
        });
      }

      const {
        rules: {
          promisesParameters: { cases: promisesCases = [] },
          availability: {
            byWeight: { min: minWeight = '0', max: maxWeight = '0' },
            byRequestTime: { dayType, fromTimeOfDay, toTimeOfDay },
          },
        },
      } = shipping;

      const exceedMaxWeight: boolean =
        Number(minWeight) >= weightOfProducts &&
        weightOfProducts >= Number(maxWeight);

      const hasSomeOffDays: boolean = await this.melonnService.hasSomeOffDays();
      const nextTenWorkingDays: string[] = await this.melonnService.nextTenWorkingDays();

      if (hasSomeOffDays) {
        return this.responseSuccess({
          message:
            'Sorry, we are on a rest day, please try again another day. These are the next ten working days.',
          data: nextTenWorkingDays,
          next,
          request,
          response,
          status: 200,
        });
      }

      if (exceedMaxWeight) {
        return this.responseSuccess({
          next,
          request,
          response,
          status: 200,
          message: `The weight of the products exceeds the maximum limit. (${maxWeight})`,
          data: dataFailed,
        });
      }

      const isValidDayType = await this.melonnService.validateDayType(
        dayType || '',
      );

      if (!isValidDayType) {
        return this.responseSuccess({
          request,
          response,
          next,
          status: 200,
          data: {},
          message: 'This service is only available for ANY & BUSINESS days.',
        });
      }

      if (Number(fromTimeOfDay) > hour) {
        return this.responseSuccess({
          next,
          request,
          response,
          status: 200,
          message: `The system is not available at this time, please try again at a valid time. Today was attended until ${fromTimeOfDay}:00`,
          data: dataFailed,
        });
      }

      for (const promiseCase of promisesCases) {
        const promiseCaseIndex: number = findIndex(promisesCases, promiseCase);

        if (
          promisesCases.length - 1 === promiseCaseIndex &&
          promiseCase.priority !== priority
        ) {
          return this.responseSuccess({
            next,
            request,
            response,
            status: 200,
            message: `The system is not available at this time, please try again at a valid time. Today was attended until ${fromTimeOfDay}:00`,
            data: dataFailed,
          });
        }

        if (promiseCase.priority !== priority) continue;

        if (isEmpty(promiseCase)) {
          return this.responseSuccess({
            next,
            request,
            response,
            status: 200,
            message: `The system is not available at this time, please try again at a valid time. Today was attended until ${fromTimeOfDay}:00`,
            data: dataFailed,
          });
        }

        const {
          condition: {
            byRequestTime: {
              dayType: promiseCaseDayType,
              fromTimeOfDay: promiseCaseFromTimeOfDay,
              toTimeOfDay: promiseCaseToTimeOfDay,
            },
          },
        }: any = promiseCase;

        const isValidPromiseCaseDayType = await this.melonnService.validateDayType(
          promiseCaseDayType || '',
        );

        if (!isValidPromiseCaseDayType) {
          return this.responseSuccess({
            request,
            response,
            next,
            status: 200,
            data: {},
            message: 'This service is only available for ANY & BUSINESS days.',
          });
        }

        if (
          Number(promiseCaseFromTimeOfDay) >= hour &&
          hour >= Number(promiseCaseToTimeOfDay)
        ) {
          priority++;
          continue;
        }

        SelectedPromiseCase = promiseCase;
        break;
      }

      const {
        packPromise: {
          min: {
            type: packPromiseMinType,
            deltaHours: packPromiseMinDeltaHours,
            deltaBusinessDays: packPromiseMinDeltaBusinessDays,
            timeOfDay: packPromiseMinTimeOfDay,
          },
          max: {
            type: packPromiseMaxType,
            deltaHours: packPromiseMaxDeltaHours,
            deltaBusinessDays: packPromiseMaxDeltaBusinessDays,
            timeOfDay: packPromiseMaxTimeOfDay,
          },
        },
      } = SelectedPromiseCase;

      let promiseCaseMinCalculated = null;
      let promiseCaseMaxCalculated = null;

      switch (packPromiseMinType) {
        case PackPromiseMinTypeEnum.NULL:
          promiseCaseMinCalculated = null;
          break;

        case PackPromiseMinTypeEnum.DELTA_HOURS:
          promiseCaseMinCalculated = hour + Number(packPromiseMinDeltaHours);
          break;

        case PackPromiseMinTypeEnum.DELTA_BUSINESSDAYS:
          promiseCaseMinCalculated = `${
            nextTenWorkingDays[Number(packPromiseMinDeltaBusinessDays) - 1]
          } at ${packPromiseMinTimeOfDay}`;

          break;

        default:
          promiseCaseMinCalculated = null;
          break;
      }

      switch (packPromiseMaxType) {
        case PackPromiseMinTypeEnum.NULL:
          promiseCaseMaxCalculated = null;
          break;

        case PackPromiseMinTypeEnum.DELTA_HOURS:
          promiseCaseMaxCalculated = hour + Number(packPromiseMaxDeltaHours);
          break;

        case PackPromiseMinTypeEnum.DELTA_BUSINESSDAYS:
          promiseCaseMaxCalculated = `${
            nextTenWorkingDays[Number(packPromiseMaxDeltaBusinessDays) - 1]
          } at ${packPromiseMaxTimeOfDay}`;
          break;

        default:
          promiseCaseMaxCalculated = null;
          break;
      }

      return this.responseSuccess({
        message: 'Calculated pledge case package.',
        data: {
          promiseCaseMinCalculated,
          promiseCaseMaxCalculated,
        },
        next,
        request,
        response,
        status: 200,
      });
    } catch (error) {
      debugger;

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
