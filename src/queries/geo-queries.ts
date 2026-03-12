import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { geoApi } from '@/api';
import type { CountriesMap, GeoEntitiesMap } from '@/models';

export const queryIds = {
  useCountries: () => ['geo', 'countries'] as const,
  useSearchGeo: (query: string) => ['geo', 'search', query] as const,
};

export const useCountries = (
  options?: Omit<UseQueryOptions<CountriesMap>, 'queryKey' | 'queryFn'>
): UseQueryResult<CountriesMap> =>
  useQuery({
    queryKey: queryIds.useCountries(),
    queryFn: geoApi.getCountries,
    ...options,
  });

export const useSearchGeo = (
  query: string,
  options?: Omit<UseQueryOptions<GeoEntitiesMap>, 'queryKey' | 'queryFn'>
): UseQueryResult<GeoEntitiesMap> =>
  useQuery({
    queryKey: queryIds.useSearchGeo(query),
    queryFn: () => geoApi.searchGeo(query),
    enabled: query.length > 0,
    ...options,
  });
