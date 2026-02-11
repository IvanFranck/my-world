import {
  SignInEmailRequest,
  SignOutResponse,
  SignUpEmailRequest,
} from "@my-website/types";
import { AuthUserEntity } from "@/types/auth/authUser.entity";

export abstract class IAuthService {
  abstract login(payload: SignInEmailRequest): Promise<AuthUserEntity>;
  abstract register(payload: SignUpEmailRequest): Promise<AuthUserEntity>;
  abstract logout(): Promise<SignOutResponse>;
  abstract me(): Promise<AuthUserEntity | null>;
}
