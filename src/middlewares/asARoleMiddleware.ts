import { Handler } from 'express';
import { Logger } from 'winston';

import { logger, RolesEnum } from 'utils';
import { RoleModel } from 'models';

export type AsARoleMiddlewareType = (role: RolesEnum | RolesEnum[]) => Handler;

const authorizationLogger: Logger = logger('authorization', '📜');

const asARoleMiddleware: AsARoleMiddlewareType = (role) => async (
  request,
  response,
  next,
) => {
  const user: any = (request as any).user;

  let userHasPermissions: boolean = false;

  if (!user._id) {
    const message: string = 'The user does not exist.';

    authorizationLogger.error(message);

    response.statusCode = 404;

    return response.status(404).json({ message }).end();
  }

  if (Array.isArray(role)) {
    const roles = role;

    let rolesFound = [];

    for (const __role of roles) {
      const roleFound: any = await RoleModel.findOne({ name: __role });

      if (roleFound._id) rolesFound.push(roleFound);
    }

    const userPermissions: boolean[] = rolesFound.map(
      (__role: { _id: string }) => {
        const userHasSomeRole: boolean = user.roles
          .map(
            (__userRole: { _id: string }) =>
              __role._id.toString() === __userRole._id.toString(),
          )
          .some(Boolean);

        return userHasSomeRole;
      },
    );

    userHasPermissions = userPermissions.some(Boolean);
  } else {
    const roleFound: any = await RoleModel.findOne({ name: role });

    if (!roleFound._id) {
      const message: string = 'The selected role does not exist.';

      authorizationLogger.error(message);

      response.statusCode = 404;

      return response.status(404).json({ message }).end();
    }

    const userPermissions: boolean[] = user.roles.map(
      (userRole: { _id: string }) =>
        userRole._id.toString() === roleFound._id.toString(),
    );

    userHasPermissions = userPermissions.some(Boolean);
  }

  if (!userHasPermissions) {
    const message: string =
      'The user does not have sufficient permissions to use this path.';

    authorizationLogger.error(message);

    response.statusCode = 401;

    return response.status(401).json({ message }).end();
  }

  next();
};

export default asARoleMiddleware;
