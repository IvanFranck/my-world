import { Injectable, Logger } from '@nestjs/common';
import { isAxiosError } from 'axios';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  /**
   * Execute a function with retry and exponential backoff
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    initialDelay: number,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // don't retry if it's a client error
        if (
          error &&
          isAxiosError(error) &&
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          throw error;
        }

        // last chance, we throw the error
        if (attempt === maxAttempts - 1) {
          this.logger.error(
            `Failed to execute function after ${maxAttempts} attempts`,
            lastError.stack,
          );
          throw lastError;
        }

        // compute the delay with exponential backoff
        const delay = this.calculateDelay(attempt, initialDelay);

        this.logger.warn(
          `Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms`,
        );

        await this.sleep(delay);
      }
    }

    // This should never be reached, but TypeScript needs a return or throw
    throw lastError!;
  }

  /**
   * Calculate delay with exponential backoff + jitter
   */
  private calculateDelay(attempt: number, initialDelay: number): number {
    // Exponential backoff: initialDelay * 2^(attempt-1)
    const exponentialDelay = initialDelay * Math.pow(2, attempt - 1);

    // Add jitter (±20%) to avoid thundering herd
    const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);

    return Math.floor(exponentialDelay + jitter);
  }

  /**
   * Utility to wait
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
