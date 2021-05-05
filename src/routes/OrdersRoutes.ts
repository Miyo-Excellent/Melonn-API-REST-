import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { OrdersController } from 'controllers';
import { MethodsEnum } from 'utils';

export type OrdersRoutesPropType = {};

export default class OrdersRoutes extends RouteHandlersExtensionMixin {
  ordersController: OrdersController = new OrdersController();
  routes: RouteType[] = [
    {
      path: '/find/:orderId',
      handler: this.ordersController.orderingInformation,
      method: MethodsEnum.GET,
    },
    {
      path: '/number-of-orders',
      handler: this.ordersController.numberOfOrders,
      method: MethodsEnum.GET,
    },
  ];

  constructor(options: OrdersRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
