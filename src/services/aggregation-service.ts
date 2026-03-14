import { tourApi } from '@/api';
import type { PriceOffer, EnrichedTour, HotelsMap } from '@/models';

class AggregationService {
  private hotelsCache = new Map<string, HotelsMap>();

  async getEnrichedTours(
    prices: PriceOffer[],
    countryId: string
  ): Promise<EnrichedTour[]> {
    if (!prices.length) {
      return [];
    }

    const hotels = await this.getHotels(countryId);
    return this.mergePricesWithHotels(prices, hotels);
  }

  private async getHotels(countryId: string): Promise<HotelsMap> {
    const cached = this.hotelsCache.get(countryId);
    if (cached) {
      return cached;
    }

    const hotels = await tourApi.getHotels(countryId);
    this.hotelsCache.set(countryId, hotels);
    return hotels;
  }

  private mergePricesWithHotels(
    prices: PriceOffer[],
    hotels: HotelsMap
  ): EnrichedTour[] {
    return prices.reduce<EnrichedTour[]>((acc, price) => {
      if (!price.hotelID) {
        return acc;
      }

      const hotel = hotels[price.hotelID];
      if (!hotel) {
        return acc;
      }

      acc.push({
        ...price,
        hotel,
      });

      return acc;
    }, []);
  }

  clearCache(): void {
    this.hotelsCache.clear();
  }
}

export const aggregationService = new AggregationService();
