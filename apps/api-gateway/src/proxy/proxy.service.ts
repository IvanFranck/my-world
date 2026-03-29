import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpClientService } from './http-client.service';
import { CircuitBreakerService } from './circuit-breaker.service';
import {
  getServiceConfig,
  ServiceName,
} from '../common/config/services.config';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ProxyOptions {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  useCircuitBreaker?: boolean;
  forwardCookies?: boolean;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  /**
   * Proxy GET request vers un microservice
   */
  async get<T = unknown>(
    serviceName: ServiceName,
    path: string,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    return this.proxyRequest<T>('GET', serviceName, path, undefined, options);
  }

  /**
   * Proxy POST request vers un microservice
   */
  async post<T = unknown>(
    serviceName: ServiceName,
    path: string,
    body?: unknown,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    return this.proxyRequest<T>('POST', serviceName, path, body, options);
  }

  /**
   * Proxy PUT request vers un microservice
   */
  async put<T = unknown>(
    serviceName: ServiceName,
    path: string,
    body?: unknown,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    return this.proxyRequest<T>('PUT', serviceName, path, body, options);
  }

  /**
   * Proxy PATCH request vers un microservice
   */
  async patch<T = unknown>(
    serviceName: ServiceName,
    path: string,
    body?: unknown,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    return this.proxyRequest<T>('PATCH', serviceName, path, body, options);
  }

  /**
   * Proxy DELETE request vers un microservice
   */
  async delete<T = unknown>(
    serviceName: ServiceName,
    path: string,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    return this.proxyRequest<T>(
      'DELETE',
      serviceName,
      path,
      undefined,
      options,
    );
  }

  /**
   * Méthode générique de proxy
   */
  private async proxyRequest<T>(
    method: string,
    serviceName: ServiceName,
    path: string,
    body?: unknown,
    options: ProxyOptions = {},
  ): Promise<{ data: T; cookies?: string[] }> {
    const serviceConfig = getServiceConfig(serviceName);
    const url = this.buildUrl(serviceConfig.baseUrl, path);

    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data: body,
      headers: options.headers || {},
      params: options.params,
      timeout: options.timeout || serviceConfig.timeout,
    };

    this.logger.log(`Proxying POST request to ${serviceName}: ${url}`);

    try {
      // Utiliser circuit breaker si activé (par défaut true)
      const useCircuitBreaker = options.useCircuitBreaker !== false;

      if (useCircuitBreaker) {
        const response: AxiosResponse<T> = await this.circuitBreaker.execute<
          AxiosResponse<T>
        >(
          serviceName,
          (): Promise<AxiosResponse<T>> =>
            this.httpClient.request<T>(requestConfig),
        );
        this.logger.log(`Response: ${JSON.stringify(response.data)}`);

        const setCookieHeaders = response.headers['set-cookie'];

        return {
          data: response.data,
          cookies: setCookieHeaders || undefined,
        };
      } else {
        const response: AxiosResponse<T> =
          await this.httpClient.request<T>(requestConfig);

        const setCookieHeaders = response.headers['set-cookie'];

        return {
          data: response.data,
          cookies: setCookieHeaders || undefined,
        };
      }
    } catch (error) {
      const err = error as AxiosError;
      this.logger.error(
        `Error proxying to ${serviceName}: ${err.message}`,
        err.stack,
      );
      throw this.handleProxyError(err);
    }
  }

  /**
   * Construire l'URL complète
   */
  private buildUrl(baseUrl: string, path: string): string {
    // Enlever le slash final de baseUrl et initial de path
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    return `${cleanBaseUrl}/${cleanPath}`;
  }

  /**
   * Gérer les erreurs de proxy
   */
  private handleProxyError(error: AxiosError): HttpException {
    if (error.response) {
      // Le service a répondu avec un status d'erreur
      throw new HttpException(
        error.response.data || 'Service error',
        error.response.status,
      );
    } else if (error.code === 'ECONNREFUSED') {
      // Service non disponible
      throw new HttpException('Service unavailable', 503);
    } else if (
      error.code === 'ETIMEDOUT' ||
      error.message.includes('timeout')
    ) {
      // Timeout
      throw new HttpException('Service timeout', 504);
    } else {
      // Erreur générique
      throw new HttpException('Internal gateway error', 500);
    }
  }
}
