import { Handler, Router as ExpressRouter } from 'express';

import { MethodsEnum } from '../utils';

export type RouteType = {
  path: string;
  method: MethodsEnum;
  handler: Handler | Handler[];
};

export type RouteHandlersExtensionOptionTypes = {};

export type RouteHandlersExtensionRouteGeneratorTypes = (
  routes: RouteType[],
) => void;

export default class RouteHandlersExtensionMixin {
  public router: ExpressRouter = ExpressRouter();

  constructor({}: RouteHandlersExtensionOptionTypes) {}

  routeGenerator: RouteHandlersExtensionRouteGeneratorTypes = (
    routes: RouteType[],
  ) => {
    routes.forEach(({ method, path, handler }: RouteType) => {
      if (Array.isArray(handler)) this.router[method](path, ...handler);
      else this.router[method](path, handler);
    });
  };
}
