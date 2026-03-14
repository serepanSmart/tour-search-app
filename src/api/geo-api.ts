import {
  getCountries as getCountriesRaw,
  searchGeo as searchGeoRaw,
} from '@/mock-api/api';
import type {
  Country,
  CountriesMap,
  GeoEntity,
  GeoEntitiesMap,
} from '@/models';

const isCountry = (value: unknown): value is Country => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.flag === 'string'
  );
};

const isGeoEntity = (value: unknown): value is GeoEntity => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    ['country', 'city', 'hotel'].includes(obj.type)
  );
};

const isCountriesMap = (data: unknown): data is CountriesMap => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Object.values(data).every(isCountry);
};

const isGeoEntitiesMap = (data: unknown): data is GeoEntitiesMap => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Object.values(data).every(isGeoEntity);
};

export const geoApi = {
  getCountries: async (): Promise<CountriesMap> => {
    const response = await getCountriesRaw();
    const data: unknown = await response.json();

    if (!isCountriesMap(data)) {
      throw new Error('Invalid countries response format');
    }

    return data;
  },

  searchGeo: async (query: string): Promise<GeoEntitiesMap> => {
    const response = await searchGeoRaw(query);
    const data: unknown = await response.json();

    if (!isGeoEntitiesMap(data)) {
      throw new Error('Invalid geo entities response format');
    }

    return data;
  },
};
