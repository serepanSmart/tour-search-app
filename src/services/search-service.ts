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

  async search(
    countryId: string
  ): Promise<{ prices: PriceOffer[]; token: string }> {
    this.abortController = new AbortController();
    let token = '';

    try {
      const { token: apiToken, waitUntil } =
        await tourApi.startSearchPrices(countryId);
      token = apiToken;
      const waitTime = calculateWaitTime(waitUntil);
      await wait(waitTime);
      const prices = await this.pollResults(token, 0);
      return { prices, token };
    } catch (error) {
      this.abortController = null;
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

  async cancel(token: string | null): Promise<void> {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (token) {
      try {
        await tourApi.stopSearchPrices(token);
      } catch {
        // Just ignore errors from cancel API, as we have already aborted the local process and don't care about remote state at this point
      }
    }
  }
}

export const searchService = new SearchService();
