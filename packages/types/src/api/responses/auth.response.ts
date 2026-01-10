import { IUserSession } from "../../entities";
import { IUser } from "../../entities/user.entity";

export interface SignInEmailResponse {
  user: IUser;
  token: string;
  redirect: boolean;
  url: string | null;
}

export interface SignUpEmailResponse {
  user: IUser;
  token: string | null;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  tokenType: string;
}

export interface SignOutResponse {
  success: boolean;
}

export interface GetSessionResponse {
  session: IUserSession;
  user: IUser;
}
