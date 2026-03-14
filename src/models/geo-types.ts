interface BaseEntity<T extends string | number = string | number> {
  id: T;
  name: string;
}

export interface Country extends BaseEntity<string> {
  flag: string;
}

export interface City extends BaseEntity<number> {
  countryId: string;
}

export interface Hotel extends BaseEntity<number> {
  img: string;
  cityId: number;
  cityName: string;
  countryId: string;
  countryName: string;
}

export type GeoEntityType = 'country' | 'city' | 'hotel';

export type GeoEntity =
  | (Country & { type: 'country' })
  | (City & { type: 'city' })
  | (Hotel & { type: 'hotel' });

export type EntityMap<T> = Record<string, T>;
export type CountriesMap = EntityMap<Country>;
export type HotelsMap = EntityMap<Hotel>;
export type GeoEntitiesMap = EntityMap<GeoEntity>;

export interface PriceOffer extends BaseEntity<string> {
  amount: number;
  currency: 'usd';
  startDate: string;
  endDate: string;
  hotelID?: string;
}

export type PricesMap = EntityMap<PriceOffer>;

interface BaseApiResponse {
  message?: string;
}

export interface ErrorResponse extends BaseApiResponse {
  code: number;
  error: true;
  message: string;
  waitUntil?: string;
}

export interface StartSearchResponse {
  token: string;
  waitUntil: string;
}

export interface GetSearchPricesResponse {
  prices: PricesMap;
}

export interface StopSearchResponse extends BaseApiResponse {
  message: string;
}

export interface EnrichedTour extends PriceOffer {
  hotel: Hotel;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  prices: PriceOffer[];
  hasSearched: boolean;
}
