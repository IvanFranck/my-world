import { HttpClient } from "@/src/core/http/httpClient";
import { IAuthService } from "./authService.contract";
import { API_BASE_URL } from "@/src/core/lib/constants";
import { authApiRoutes } from "./authApiRoutes";
import {
  GetSessionResponse,
  SignInEmailRequest,
  SignInEmailResponse,
  SignOutResponse,
  SignUpEmailRequest,
  SignUpEmailResponse,
} from "@my-website/types";
import { TokenManager } from "@/src/core/http/tokenManager";
import { AuthUserEntity } from "@/src/types/auth/authUser.entity";
import { AuthMapper } from "./mappers/authMapper";

class AuthService extends HttpClient implements IAuthService {
  constructor(baseUrl?: string) {
    super(baseUrl || API_BASE_URL);
  }
  async login(payload: SignInEmailRequest): Promise<AuthUserEntity> {
    const response = await this.post<SignInEmailResponse>(
      authApiRoutes.login,
      payload,
    );

    TokenManager.setToken(response.token);
    return AuthMapper.mapAuthUserFromSignInEmailResponse(response);
  }

  async register(payload: SignUpEmailRequest): Promise<AuthUserEntity> {
    const response = await this.post<SignUpEmailResponse>(
      authApiRoutes.register,
      payload,
    );
    return AuthMapper.mapAuthUserFromSignUpEmailResponse(response);
  }

  async logout(): Promise<SignOutResponse> {
    const response = await this.post<SignOutResponse>(authApiRoutes.logout, {});
    TokenManager.removeToken();
    return response;
  }

  async me(): Promise<AuthUserEntity | null> {
    const response = await this.get<GetSessionResponse>(authApiRoutes.me);
    return AuthMapper.mapAuthUserFromGetSessionResponse(response);
  }
}

export const authService = new AuthService();
