import { searchService } from './search-service';
import { aggregationService } from './aggregation-service';
import type { EnrichedTour } from '@/models';

class SearchManager {
  private currentParamsHash: string | null = null;
  private isSearching = false;

  async search(countryId: string): Promise<EnrichedTour[]> {
    const paramsHash = this.getParamsHash(countryId);

    if (this.isSearching && paramsHash === this.currentParamsHash) {
      throw new Error('Search already in progress with same parameters');
    }

    if (this.isSearching && paramsHash !== this.currentParamsHash) {
      await this.cancel();
    }

    this.isSearching = true;
    this.currentParamsHash = paramsHash;

    try {
      const prices = await searchService.search(countryId);
      const enrichedTours = await aggregationService.getEnrichedTours(
        prices,
        countryId
      );

      return enrichedTours;
    } finally {
      this.isSearching = false;
    }
  }

  async cancel(): Promise<void> {
    await searchService.cancel();
    this.currentParamsHash = null;
    this.isSearching = false;
  }

  resetParams(): void {
    this.currentParamsHash = null;
  }

  getIsSearching(): boolean {
    return this.isSearching;
  }

  private getParamsHash(countryId: string): string {
    return countryId;
  }
}

export const searchManager = new SearchManager();
