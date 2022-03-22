import Logger from '../log/logger';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GrantTypes } from './generateToken';

type AuthTokenResult = {
  userId: string;
  grantType: GrantTypes;
};

export default function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader?.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, result: AuthTokenResult) => {
      if (err || result.grantType !== GrantTypes.AuthorizationCode) {
        const ip =
          req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        Logger.warn(
          `The request ${ip} : ${req.headers.host} has invalid token : ${err.name} : ${err.message} - ${err.stack}`,
        );

        return res.status(403).json({ msg: 'E_INVALID_TOKEN' });
      }

      req.userId = result.userId;

      next();
    },
  );
}
