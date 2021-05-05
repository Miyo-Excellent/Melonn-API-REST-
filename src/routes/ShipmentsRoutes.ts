import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { MethodsEnum } from 'utils';
import { ShipmentsController } from 'controllers';

export type ShippingRoutesPropType = {};

export default class ShipmentsRoutes extends RouteHandlersExtensionMixin {
  shippingController: ShipmentsController = new ShipmentsController();

  routes: RouteType[] = [
    {
      path: '/find/:shippingId',
      handler: this.shippingController.informationAboutShipping,
      method: MethodsEnum.GET,
    },
    {
      path: '/all',
      handler: this.shippingController.numberOfShipments,
      method: MethodsEnum.GET,
    },
    {
      path: '/off-days',
      handler: this.shippingController.offDays,
      method: MethodsEnum.GET,
    },
  ];

  constructor(options: ShippingRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
