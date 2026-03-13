import { useQuery } from '@tanstack/react-query';
import { tourApi } from '@/api';
import { isHotelsMap, isHotel } from '@/utils/narrow-hotels-map';
import type { PriceOffer, EnrichedTour, HotelsMap } from '@/models';

export const useEnrichedTours = (
  prices: PriceOffer[],
  countryId?: string
): EnrichedTour[] => {
  const { data } = useQuery<HotelsMap | undefined>({
    queryKey: ['hotels', countryId],
    queryFn: async () => {
      if (!countryId) {
        return;
      }
      const hotelsMap = await tourApi.getHotels(countryId);
      if (!isHotelsMap(hotelsMap)) {
        throw new Error('Invalid HotelsMap');
      }
      return hotelsMap;
    },
    enabled: Boolean(countryId),
    staleTime: 10 * 60 * 1000,
  });

  if (!data || !prices.length) {
    return [];
  }

  const hotelsArray = Object.entries(data);

  return prices.flatMap((price) => {
    if (typeof price.hotelId !== 'string') {
      return [];
    }
    const found = hotelsArray.find(
      ([key, hotel]) => key === price.hotelId && isHotel(hotel)
    );
    if (!found) {
      return [];
    }
    const [, hotel] = found;
    return [{ ...price, hotel }];
  });
};
