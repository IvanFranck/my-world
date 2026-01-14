export interface ServiceConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export enum ServiceName {
  AUTH_SERVICE = 'auth-service',
  CONTENT_SERVICE = 'content-service',
}

export const SERVICE_CONFIG: Record<ServiceName, ServiceConfig> = {
  [ServiceName.AUTH_SERVICE]: {
    name: ServiceName.AUTH_SERVICE,
    baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  [ServiceName.CONTENT_SERVICE]: {
    name: ServiceName.AUTH_SERVICE,
    baseUrl: process.env.CONTENT_SERVICE_URL || 'http://localhost:3002',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
};

export const getServiceConfig = (name: ServiceName): ServiceConfig => {
  const config = SERVICE_CONFIG[name];
  if (!config) {
    throw new Error(`Service config not found for ${name}`);
  }
  return config;
};
