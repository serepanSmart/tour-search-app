import type { HotelsMap, Hotel } from '@/models';

export const isHotel = (data: unknown): data is Hotel => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const h = data as Partial<Hotel>;
  return (
    typeof h.id === 'number' &&
    typeof h.name === 'string' &&
    typeof h.img === 'string' &&
    typeof h.cityId === 'number' &&
    typeof h.cityName === 'string' &&
    typeof h.countryId === 'string' &&
    typeof h.countryName === 'string'
  );
};

export const isHotelsMap = (data: unknown): data is HotelsMap => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const entries = Object.entries(data);
  if (!entries.length) {
    return true;
  }
  return entries.every(([_, value]) => isHotel(value));
};
