export interface SignInEmailRequest {
  email: string;
  password: string;
}

export interface SignUpEmailRequest {
  email: string;
  password: string;
  name: string;
  image?: string;
}

export interface RefreshTokenRequest {
  providerId: string;
  accountId?: string;
  userId?: string;
}
