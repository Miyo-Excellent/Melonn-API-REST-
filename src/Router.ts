import { Handler, Router as ExpressRouter } from 'express';
import { ApiMixin } from 'mixins';
import {
  AuthorizationRoutes,
  InvoicesRoutes,
  OrdersRoutes,
  ProductsRoutes,
  SalesRoutes,
  ShipmentsRoutes,
  UsersRoutes,
} from 'routes';
import { asARoleMiddleware, authorizationMiddleware } from 'middlewares';
import config from 'config';

export type RouteType = {
  path: string;
  router: ExpressRouter | Handler | Handler[] | ExpressRouter[];
};

export type RouterPropType = {};

export type RouterConfigPropTypes = () => void;

export default class Router extends ApiMixin {
  public router: ExpressRouter;
  private authorizationRoutes: AuthorizationRoutes;
  private salesRoutes: SalesRoutes;
  private ordersRoutes: OrdersRoutes;
  private productsRoutes: ProductsRoutes;
  private usersRoutes: UsersRoutes;
  private invoicesRoutes: InvoicesRoutes;
  private shipmentsRoutes: ShipmentsRoutes;

  constructor(options: RouterPropType = {}) {
    super(options);

    this.router = ExpressRouter();
    this.authorizationRoutes = new AuthorizationRoutes();
    this.salesRoutes = new SalesRoutes();
    this.ordersRoutes = new OrdersRoutes();
    this.productsRoutes = new ProductsRoutes();
    this.usersRoutes = new UsersRoutes();
    this.invoicesRoutes = new InvoicesRoutes();
    this.shipmentsRoutes = new ShipmentsRoutes();

    this.config();
  }

  private config: RouterConfigPropTypes = (): void => {
    const routes: RouteType[] = [
      { path: '/auth', router: this.authorizationRoutes.router },
      {
        path: '/sales',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.salesRoutes.router,
        ],
      },
      {
        path: '/orders',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.ordersRoutes.router,
        ],
      },
      {
        path: '/products',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.productsRoutes.router,
        ],
      },
      {
        path: '/users',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.usersRoutes.router,
        ],
      },
      {
        path: '/invoices',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.invoicesRoutes.router,
        ],
      },
      {
        path: '/shipments',
        router: [
          authorizationMiddleware,
          asARoleMiddleware(config.database.roles),
          this.shipmentsRoutes.router,
        ],
      },
    ];

    routes.forEach(({ path, router }: RouteType) => {
      if (Array.isArray(router)) return this.router.use(path, ...router);

      return this.router.use(path, router);
    });
  };
}
