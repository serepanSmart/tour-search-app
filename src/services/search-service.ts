import { tourApi } from '@/api';
import type { PriceOffer, ErrorResponse } from '@/models';

const MAX_RETRIES = 2;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const calculateWaitTime = (waitUntil: string): number => {
  const targetTime = new Date(waitUntil).getTime();
  const now = Date.now();
  return Math.max(0, targetTime - now);
};

export class SearchService {
  private abortController: AbortController | null = null;
  private currentToken: string | null = null;

  async search(countryId: string): Promise<PriceOffer[]> {
    this.abortController = new AbortController();

    try {
      const { token, waitUntil } = await tourApi.startSearchPrices(countryId);
      this.currentToken = token;

      const waitTime = calculateWaitTime(waitUntil);
      await wait(waitTime);

      const prices = await this.pollResults(token, 0);
      return prices;
    } catch (error) {
      this.abortController = null;
      this.currentToken = null;
      throw error;
    }
  }

  private async pollResults(
    token: string,
    retryCount: number
  ): Promise<PriceOffer[]> {
    if (this.abortController?.signal.aborted) {
      throw new Error('Search cancelled');
    }

    try {
      const response = await tourApi.getSearchPrices(token);
      this.abortController = null;
      return Object.values(response.prices);
    } catch (error) {
      if (this.isErrorResponse(error) && error.errorResponse.code === 425) {
        const waitTime = calculateWaitTime(error.errorResponse.waitUntil || '');
        await wait(waitTime);
        return this.pollResults(token, retryCount);
      }

      if (retryCount < MAX_RETRIES) {
        await wait(1000);
        return this.pollResults(token, retryCount + 1);
      }

      this.abortController = null;
      throw error;
    }
  }

  private isErrorResponse(
    error: unknown
  ): error is { errorResponse: ErrorResponse } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'errorResponse' in error &&
      typeof (error as { errorResponse: unknown }).errorResponse === 'object'
    );
  }

  async cancel(): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.currentToken) {
      try {
        await tourApi.stopSearchPrices(this.currentToken);
      } catch {
        // Ignore cancel errors
      } finally {
        this.currentToken = null;
      }
    }
  }
}

export const searchService = new SearchService();
