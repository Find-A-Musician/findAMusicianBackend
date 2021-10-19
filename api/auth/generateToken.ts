import jwt from 'jsonwebtoken';

export enum GrantTypes {
  AuthorizationCode,
  RefreshToken,
}

const EXPIRATION_TOKEN = '1h';

export default function generateToken(
  grantType: GrantTypes,
  userId: string,
): string {
  switch (grantType) {
    case GrantTypes.AuthorizationCode:
      return jwt.sign({ userId, grantType }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: EXPIRATION_TOKEN,
      });
    case GrantTypes.RefreshToken:
      return jwt.sign(
        {
          userId,
          grantType,
        },
        process.env.REFRESH_TOKEN_SECRET,
      );
  }
}
