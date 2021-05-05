import { DaysTypesEnum, fetch } from 'utils';
import moment from 'moment';
import { difference } from 'lodash';

import config from 'config';

export type MelonnServicePropTypes = {};

export type MelonnServiceValidateBasedOnWeightAvailabilityTypes = () => Promise<boolean>;

export type MelonnServiceValidateDayType = (type: string) => Promise<boolean>;

export type MelonnServiceValidateBasedOnWeightRulesDentaType = {
  type: string;
  deltaHours?: number;
  deltaBusinessDays?: number;
  timeOfDay?: number;
};

export type MelonnServiceValidateBasedOnWeightRulesRangeType = {
  min?: number;
  max?: number;
};

export type MelonnServiceValidateBasedOnWeightRulesPromiseType = {
  min?: MelonnServiceValidateBasedOnWeightRulesDentaType;
  max?: MelonnServiceValidateBasedOnWeightRulesDentaType;
};

export type MelonnServiceValidateBasedOnWeightRulesTimeType = {
  dayType?: string;
  fromTimeOfDay?: number;
  toTimeOfDay?: number;
};

export type MelonnServiceValidateBasedOnWeightPromiseCaseTypes = {
  priority: number;
  condition: {
    byRequestTime: MelonnServiceValidateBasedOnWeightRulesTimeType;
  };
  packPromise: MelonnServiceValidateBasedOnWeightRulesPromiseType;
  shipPromise: MelonnServiceValidateBasedOnWeightRulesPromiseType;
  deliveryPromise: MelonnServiceValidateBasedOnWeightRulesPromiseType;
  readyPickUpPromise: MelonnServiceValidateBasedOnWeightRulesPromiseType;
};

export type MelonnServiceValidateBasedOnWeightPromisesCasesTypes = MelonnServiceValidateBasedOnWeightPromiseCaseTypes[];

export type MelonnServiceValidateBasedOnWeightRulesTypes = {
  rules: {
    availability: {
      byWeight: MelonnServiceValidateBasedOnWeightRulesRangeType;
      byRequestTime: MelonnServiceValidateBasedOnWeightRulesTimeType;
      byWarehouseCoverage: {
        type: string;
      };
    };
    promisesParameters: {
      cases: MelonnServiceValidateBasedOnWeightPromisesCasesTypes;
    };
  }
};

export default class MelonnService {
  url: string = config.keys.melonnApiUrl;
  apiKey: string = config.keys.melonnApiKey;

  constructor({}: MelonnServicePropTypes = {}) {}

  async shippingMethods(): Promise<any> {
    return fetch({
      url: `${this.url}/shipping-methods`,
      headers: { 'x-api-key': this.apiKey },
    });
  }

  async shippingMethodById(shippingId: number): Promise<any> {
    return fetch({
      url: `${this.url}/shipping-methods/${shippingId}`,
      headers: { 'x-api-key': this.apiKey },
    });
  }

  async offDays(): Promise<any> {
    return fetch({
      url: `${this.url}/off-days`,
      headers: { 'x-api-key': this.apiKey },
    });
  }

  async hasSomeOffDays(): Promise<boolean> {
    const today = moment().add(2, 'days').format('YYYY-MM-DD');

    const offDays: [] = await this.offDays();

    const hasSomeOffDays: boolean = offDays
      .map((date) => date === today)
      .some(Boolean);

    return hasSomeOffDays;
  }

  async nextTenWorkingDays(): Promise<string[]> {
    const offDays: any[] = await this.offDays();

    const days: string[] = new Array(offDays.length)
      .fill(null)
      .map((_: any, index: number) =>
        moment().add(index, 'days').format('YYYY-MM-DD'),
      );

    const workingDays: string[] = difference(days, offDays).sort((date) =>
      moment(date).unix(),
    );

    return workingDays.slice(0, 10);
  }

  validateBasedOnWeightAvailability: MelonnServiceValidateBasedOnWeightAvailabilityTypes = async (): Promise<boolean> => {
    return false;
  };

  validateDayType: MelonnServiceValidateDayType = async (
    type,
  ): Promise<boolean> => {
    switch (type) {
      case DaysTypesEnum.ANY:
        return true;

      case DaysTypesEnum.BUSINESS:
        return true;

      default:
        return false;
    }
  };
}
