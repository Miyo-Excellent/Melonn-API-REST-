import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { ProductsController } from 'controllers';
import { MethodsEnum } from 'utils';

export type ProductsRoutesPropType = {};

export default class ProductsRoutes extends RouteHandlersExtensionMixin {
  productsControllers: ProductsController = new ProductsController();
  routes: RouteType[] = [
    {
      path: '/find/:productId',
      handler: this.productsControllers.informationAboutProduct,
      method: MethodsEnum.GET,
    },
    {
      path: '/find/:productId',
      handler: this.productsControllers.update,
      method: MethodsEnum.PUT,
    },
    {
      path: '/find/:productId',
      handler: this.productsControllers.delete,
      method: MethodsEnum.DELETE,
    },
    {
      path: '/create',
      handler: this.productsControllers.create,
      method: MethodsEnum.POST,
    },
    {
      path: '/number-of-products',
      handler: this.productsControllers.numberOfProducts,
      method: MethodsEnum.GET,
    },
  ];

  constructor(options: ProductsRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
