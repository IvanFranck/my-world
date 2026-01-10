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
   * Do Http request with automatic retry, returning full AxiosResponse
   */
  async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const executeRequest = async () => {
      const response: AxiosResponse<T> =
        await this.httpService.axiosRef.request(config);
      return response;
    };

    return this.retryService.executeWithRetry(
      executeRequest,
      3, // 3 attempts max
      1000, // 1 second initial delay
    );
  }
}
