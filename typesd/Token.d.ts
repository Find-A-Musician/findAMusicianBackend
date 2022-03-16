import { Musician } from '.';
export declare type GrantTypes = 'AuthorizationCode' | 'RefreshToken';
export declare class Token {
  id: string;
  token: string;
  grandType: GrantTypes;
  musician: Musician;
}
