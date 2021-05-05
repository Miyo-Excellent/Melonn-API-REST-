import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { MethodsEnum } from 'utils';
import { InvoicesController } from 'controllers';

export type InvoicesRoutesPropType = {};

export default class InvoicesRoutes extends RouteHandlersExtensionMixin {
  invoicesController: InvoicesController = new InvoicesController();
  routes: RouteType[] = [
    {
      path: '/find/:invoiceId',
      handler: this.invoicesController.informationAboutInvoice,
      method: MethodsEnum.GET,
    },
    {
      path: '/number-of-invoices',
      handler: this.invoicesController.numberOfInvoices,
      method: MethodsEnum.GET,
    },
  ];

  constructor(options: InvoicesRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
