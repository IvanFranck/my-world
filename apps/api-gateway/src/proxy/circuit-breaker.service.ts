import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker, { Options as CircuitBreakerOptions } from 'opossum';

enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerStats {
  failures: number;
  successes: number;
  rejects: number;
  timeouts: number;
  state: CircuitBreakerState;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly breakers: Map<string, CircuitBreaker> = new Map();

  /**
   * default options for circuit breaker
   */
  private readonly defaultOptions: CircuitBreakerOptions = {
    timeout: 10000, // 10 secondes
    errorThresholdPercentage: 50, // Ouvrir après 50% d'échecs
    resetTimeout: 30000, // Réessayer après 30 secondes
    rollingCountTimeout: 10000,
    rollingCountBuckets: 10,
    volumeThreshold: 10, // Minimum de requêtes avant d'évaluer
  };

  /**
   * Get or create a circuit breaker for a service
   */
  private getOrCreateCircuitBreaker(serviceName: string): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      const breaker = new CircuitBreaker(
        async (fn: () => Promise<unknown>) => await fn(),
        this.defaultOptions,
      );

      // monitooring events
      breaker.on('open', () => {
        this.logger.warn(`Circuit breaker for ${serviceName} is open`);
      });
      breaker.on('close', () => {
        this.logger.warn(`Circuit breaker for ${serviceName} is closed`);
      });
      breaker.on('halfOpen', () => {
        this.logger.warn(`Circuit breaker for ${serviceName} is half open`);
      });

      breaker.on('failure', (error: Error) => {
        this.logger.error(
          `Circuit breaker for ${serviceName} failed: ${error.message}`,
        );
      });

      this.breakers.set(serviceName, breaker);
    }

    return this.breakers.get(serviceName)!;
  }

  /**
   * execute a function with circuit breaker
   */
  async execute<T = unknown>(
    serviceName: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const breaker = this.getOrCreateCircuitBreaker(serviceName);

    try {
      return (await breaker.fire(fn)) as T;
    } catch (error) {
      const err = error as Error;
      if (err.message === 'Breaker is open') {
        this.logger.error(
          `Circuit breaker is OPEN for ${serviceName}, request rejected`,
        );
        throw new Error(`Service ${serviceName} is temporarily unavailable`);
      }
      throw err;
    }
  }

  /**
   * Get the stats of a circuit breaker
   */
  getStats(serviceName: string): CircuitBreakerStats | null {
    const breaker = this.breakers.get(serviceName);
    if (!breaker) {
      return null;
    }

    const stats = breaker.stats;
    return {
      failures: stats.failures,
      successes: stats.successes,
      rejects: stats.rejects,
      timeouts: stats.timeouts,
      state: breaker.opened
        ? CircuitBreakerState.OPEN
        : breaker.halfOpen
          ? CircuitBreakerState.HALF_OPEN
          : CircuitBreakerState.CLOSED,
    };
  }

  /**
   * Reset the circuit breaker
   */
  reset(serviceName: string): void {
    const breaker = this.breakers.get(serviceName);
    if (!breaker) {
      return;
    }
    breaker.close();
    this.logger.log(`Circuit breaker reset for ${serviceName}`);
  }

  getAllStats(): Record<string, CircuitBreakerStats> {
    const allStats: Record<string, CircuitBreakerStats> = {};

    this.breakers.forEach((breaker, serviceName) => {
      const stats = this.getStats(serviceName);
      if (stats) {
        allStats[serviceName] = stats;
      }
    });

    return allStats;
  }
}
