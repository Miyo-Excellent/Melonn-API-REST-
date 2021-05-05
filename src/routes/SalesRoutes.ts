import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { MethodsEnum } from 'utils';
import { SalesController } from 'controllers';

export type SalesRoutesPropType = {};

export default class SalesRoutes extends RouteHandlersExtensionMixin {
  salesController: SalesController = new SalesController();

  routes: RouteType[] = [
    {
      path: '/create/:shippingId',
      handler: this.salesController.generateSale,
      method: MethodsEnum.POST,
    },
    {
      path: '/find/:salesId',
      handler: this.salesController.informationAboutSale,
      method: MethodsEnum.GET,
    },
    {
      path: '/number-of-sales',
      handler: this.salesController.numberOfSales,
      method: MethodsEnum.GET,
    },
  ];
  constructor(options: SalesRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
