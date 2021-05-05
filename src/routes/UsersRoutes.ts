import { RouteHandlersExtensionMixin, RouteType } from 'mixins';
import { MethodsEnum } from 'utils';
import { UsersController } from 'controllers';

export type UsersRoutesPropType = {};

export default class UsersRoutes extends RouteHandlersExtensionMixin {
  usersController: UsersController = new UsersController();

  routes: RouteType[] = [
    {
      path: '/create',
      handler: this.usersController.create,
      method: MethodsEnum.POST,
    },
    {
      path: '/delete',
      handler: this.usersController.delete,
      method: MethodsEnum.DELETE,
    },
    {
      path: '/update',
      handler: this.usersController.update,
      method: MethodsEnum.PUT,
    },
    {
      path: '/find/:userId',
      handler: this.usersController.informationAboutUser,
      method: MethodsEnum.GET,
    },
    {
      path: '/number-of-users',
      handler: this.usersController.numberOfUsers,
      method: MethodsEnum.GET,
    },
  ];

  constructor(options: UsersRoutesPropType = {}) {
    super(options);

    this.routeGenerator(this.routes);
  }
}
