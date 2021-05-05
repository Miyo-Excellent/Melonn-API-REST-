import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { MethodsEnum } from 'utils';
import { AuthorizationController } from 'controllers';

export type AuthorizationRoutesPropType = {};

export default class AuthorizationRoutes extends RouteHandlersExtensionMixin {
  salesController: AuthorizationController = new AuthorizationController();

  routes: RouteType[] = [
    {
      path: '/sign-in',
      handler: this.salesController.signIn,
      method: MethodsEnum.POST,
    },
    {
      path: '/sign-up',
      handler: this.salesController.signUp,
      method: MethodsEnum.POST,
    },
  ];

  constructor(options: AuthorizationRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
