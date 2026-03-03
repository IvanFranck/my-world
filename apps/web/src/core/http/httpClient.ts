import { API_BASE_URL } from "@/src/app/lib/constants";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { TokenManager } from "./tokenManager";
import { RefreshTokenResponse } from "@my-website/types";
import { authApiRoutes } from "@/src/services/auth/authApiRoutes";

interface QueueItem {
  resolve: (value: string) => void;
  reject: (reason: AxiosError) => void;
}

const AuthEnpoints = [
  "auth/login",
  "auth/register",
  "auth/verify-email",
  "auth/reset-password",
  "auth/request-password-reset",
];

export abstract class HttpClient {
  protected readonly baseUrl: string;
  protected readonly client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  private isRefreshing = false;
  private failedQueue: QueueItem[] = [];

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
    this.client.defaults.baseURL = this.baseUrl;
    this.setupInterceptor();
  }

  private processQueue(error: AxiosError | null, token: string | null = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token as string);
      }
    });

    this.failedQueue = [];
  }

  private setupInterceptor() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const isAuthEnpoint = AuthEnpoints.includes(config.url as string);

        if (!isAuthEnpoint) {
          const token = TokenManager.getToken();
          if (token) {
            // Check if the token expires in less than 2 minutes
            if (TokenManager.isTokenExpired(token, 120)) {
              this.isRefreshing = true;
              try {
                const response = await this.client.post<RefreshTokenResponse>(
                  authApiRoutes.refreshToken,
                  {
                    refreshToken: token,
                  },
                );
                TokenManager.setToken(response.data.accessToken);
                config.headers.Authorization = `Bearer ${response.data.accessToken}`;
              } catch {
                // Refresh failed, continue with the current token (will likely expire soon)
              } finally {
                this.isRefreshing = false;
              }
            }
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        const token = TokenManager.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthEnpoint = AuthEnpoints.includes(
          originalRequest.url as string,
        );

        // if error is 401 an we haven't retried yet, try to refresh the token
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEnpoint
        ) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client.request(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const response = await this.client.post<RefreshTokenResponse>(
              authApiRoutes.refreshToken,
              {},
            );
            TokenManager.setToken(response.data.accessToken);

            // token successfuly refreshed, process  the queue
            const newToken = TokenManager.getToken();
            this.processQueue(null, newToken);
            this.isRefreshing = false;

            // retry the original request with the new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client.request(originalRequest);
          } catch (err) {
            this.processQueue(err as AxiosError, null);
            TokenManager.removeToken();
            this.isRefreshing = false;

            // if refresh token fails, reject the original request
            return Promise.reject(error);
          }
        }
      },
    );
  }

  // Generic method to make a request
  protected async get<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.get<T>(url, options);
    return response.data;
  }

  protected async post<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, options);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data: unknown,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, options);
    return response.data;
  }

  protected async delete<T>(
    url: string,
    options: AxiosRequestConfig = {},
  ): Promise<T> {
    const response = await this.client.delete<T>(url, options);
    return response.data;
  }
}
