import { Handler, NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';
import { verify } from 'jsonwebtoken';

import { UserModel } from 'models';

import config from 'config';
import { logger } from 'utils';

const authorizationLogger: Logger = logger('authorization', '📜');

const authorizationMiddleware: Handler = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authorization: string = request.headers.authorization || '';

  const [label = '', token = ''] = authorization.split(' ');

  if (!authorization || !token) {
    const message: string =
      'An authorization token is required to access this route.';

    authorizationLogger.error(message);

    return response
      .status(401)
      .json({
        message,
      })
      .end();
  }

  const decoded: any = await verify(token, config.keys.jwtSecret);

  if (!decoded || !decoded._id) {
    const message: string = 'The token is not valid.';

    authorizationLogger.error(message);

    response.statusCode = 401;

    return response.status(401).json({ message }).end();
  }

  const user: any = await UserModel.findById(decoded._id);

  if (!user) {
    const message: string = 'The user does not exist.';

    authorizationLogger.error(message);

    response.statusCode = 404;

    return response.status(404).json({ message }).end();
  }

  const userData = {
    _id: user._id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    lastname: user.lastname,
    email: user.email,
    roles: user.roles.map(({ _id }: { _id: string }) => ({ _id })),
  };

  authorizationLogger.info(
    `${user.name} (ID:${user._id}) was successfully cleared.`,
  );

  (request as any).user = userData;

  next();
};

export default authorizationMiddleware;
