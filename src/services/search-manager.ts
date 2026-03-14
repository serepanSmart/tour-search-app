import { searchService } from './search-service';
import { aggregationService } from './aggregation-service';
import type { EnrichedTour } from '@/models';

interface SearchFilters {
  hotelId?: number;
  cityId?: number;
}

class SearchManager {
  private currentParamsHash: string | null = null;
  private isSearching = false;

  async search(
    countryId: string,
    filters?: SearchFilters
  ): Promise<EnrichedTour[]> {
    const paramsHash = this.getParamsHash(countryId, filters);

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

      return this.applyFilters(enrichedTours, filters);
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

  private applyFilters(
    tours: EnrichedTour[],
    filters?: SearchFilters
  ): EnrichedTour[] {
    if (!filters) {
      return tours;
    }

    let filtered = tours;

    if (filters.hotelId) {
      filtered = filtered.filter((tour) => tour.hotel.id === filters.hotelId);
    }

    if (filters.cityId && !filters.hotelId) {
      filtered = filtered.filter(
        (tour) => tour.hotel.cityId === filters.cityId
      );
    }

    return filtered;
  }

  private getParamsHash(countryId: string, filters?: SearchFilters): string {
    const parts = [countryId];
    if (filters?.hotelId) {
      parts.push(`hotel:${filters.hotelId}`);
    }
    if (filters?.cityId) {
      parts.push(`city:${filters.cityId}`);
    }
    return parts.join('|');
  }
}

export const searchManager = new SearchManager();
