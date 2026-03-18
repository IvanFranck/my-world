import { AuthUserEntity } from "@/src/types/auth/authUser.entity";
import {
  GetSessionResponse,
  SignInEmailResponse,
  SignUpEmailResponse,
} from "@my-website/types";

export class AuthMapper {
  static mapAuthUserFromSignInEmailResponse(
    response: SignInEmailResponse,
  ): AuthUserEntity {
    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      image: response.user.image || null,
    };
  }

  static mapAuthUserFromSignUpEmailResponse(
    response: SignUpEmailResponse,
  ): AuthUserEntity {
    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      image: response.user.image || null,
    };
  }

  static mapAuthUserFromGetSessionResponse(
    response: GetSessionResponse,
  ): AuthUserEntity | null {
    if (!response) {
      return null;
    }

    return {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      image: response.user.image || null,
    };
  }
}
