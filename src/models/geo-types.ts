export interface Country {
  id: string;
  name: string;
  flag: string;
}

export interface City {
  id: number;
  name: string;
  countryId: string;
}

export interface Hotel {
  id: number;
  name: string;
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

export type GeoEntitiesMap = Record<string, GeoEntity>;
export type CountriesMap = Record<string, Country>;
