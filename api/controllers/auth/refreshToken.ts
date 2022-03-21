import jwt from 'jsonwebtoken';
import generateToken, { GrantTypes } from '../../auth/generateToken';
import { getRepository } from 'typeorm';
import { Token } from '../../entity';
import type { operations } from '@schema';
import type { NextFunction, Request } from 'express';
import type core from 'express-serve-static-core';
import type { getHTTPCode, getRequestBody, getResponsesBody } from '@typing';

type AuthTokenResult = {
  userId: string;
  grantType: GrantTypes;
};

type PostToken = operations['postRefreshToken'];

const refreshToken = async (
  req: Request<{}, getResponsesBody<PostToken>, getRequestBody<PostToken>, {}>,
  res: core.Response<getResponsesBody<PostToken>, {}, getHTTPCode<PostToken>>,
  next: NextFunction,
): Promise<
  core.Response<getResponsesBody<PostToken>, {}, getHTTPCode<PostToken>>
> => {
  try {
    const token = await getRepository(Token).findOne({
      token: req.body.refreshToken,
      grandType: 'RefreshToken',
    });

    if (!token) {
      return res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
    }

    jwt.verify(
      req.body.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, result: AuthTokenResult) => {
        if (err) {
          return res.status(401).json({ msg: 'E_INVALID_REFRESH_TOKEN' });
        }
        const accessToken = generateToken(
          GrantTypes.AuthorizationCode,
          result.userId,
        );

        return res.status(200).json({ accessToken });
      },
    );
  } catch (err) {
    next(err);
  }
};

export { refreshToken };
