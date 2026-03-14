import { tourApi, geoApi } from '@/api';
import type {
  PriceOffer,
  EnrichedTour,
  HotelsMap,
  CountriesMap,
} from '@/models';

class AggregationService {
  private hotelsCache = new Map<string, HotelsMap>();
  private countriesCache: CountriesMap | null = null;

  async getEnrichedTours(
    prices: PriceOffer[],
    countryId: string
  ): Promise<EnrichedTour[]> {
    if (!prices.length) {
      return [];
    }

    const [hotels, countries] = await Promise.all([
      this.getHotels(countryId),
      this.getCountries(),
    ]);

    const countryFlag = countries[countryId]?.flag || '';

    return this.mergePricesWithHotels(prices, hotels, countryFlag);
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

  private async getCountries(): Promise<CountriesMap> {
    if (this.countriesCache) {
      return this.countriesCache;
    }

    const countries = await geoApi.getCountries();
    this.countriesCache = countries;
    return countries;
  }

  private mergePricesWithHotels(
    prices: PriceOffer[],
    hotels: HotelsMap,
    countryFlag: string
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
        countryFlag,
      });

      return acc;
    }, []);
  }

  clearCache(): void {
    this.hotelsCache.clear();
    this.countriesCache = null;
  }
}

export const aggregationService = new AggregationService();
