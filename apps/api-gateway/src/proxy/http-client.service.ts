import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { RetryService } from './retry.service';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly retryService: RetryService,
  ) {
    // Interceptor fo requests logger
    this.httpService.axiosRef.interceptors.response.use(
      (config) => {
        this.logger.debug(
          `Request: ${config.config.method?.toUpperCase()} ${config.config.url}`,
        );
        return config;
      },
      (error) => {
        this.logger.error('Request error:', error);
        return Promise.reject(error as Error);
      },
    );

    // Interceptor for responses logger
    this.httpService.axiosRef.interceptors.response.use(
      (response) => {
        this.logger.debug(
          `Response: ${response.status} from ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        const axiosError = error as AxiosError;
        this.logger.error(
          `Response error: ${axiosError.response?.status} from ${axiosError.config?.url}`,
        );
        return Promise.reject(axiosError);
      },
    );
  }

  /**
   * Do Http request with automatic retry
   */
  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const executeRequest = async () => {
      const response: AxiosResponse<T> =
        await this.httpService.axiosRef.request(config);
      return response.data;
    };

    return this.retryService.executeWithRetry(
      executeRequest,
      3, // 3 attempts max
      1000, // 1 second initial delay
    );
  }
  /**
   * Get request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      ...config,
    });
  }

  /**
   * POST request
   */
  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PATCH request
   */
  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}
