export interface ServiceConfig {
  name: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const SERVICE_CONFIG: Record<string, ServiceConfig> = {
  'auth-service': {
    name: 'auth-service',
    baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
};

export const getServiceConfig = (name: string): ServiceConfig => {
  const config = SERVICE_CONFIG[name];
  if (!config) {
    throw new Error(`Service config not found for ${name}`);
  }
  return config;
};
