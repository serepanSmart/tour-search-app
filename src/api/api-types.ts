import type { CountriesMap, GeoEntitiesMap } from '@/models';

export interface ApiResponse<T> {
  json: () => Promise<T>;
}

export type GetCountriesResponse = ApiResponse<CountriesMap>;
export type SearchGeoResponse = ApiResponse<GeoEntitiesMap>;
