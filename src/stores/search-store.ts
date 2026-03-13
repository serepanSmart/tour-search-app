import { create } from 'zustand';
import type { GeoEntity, PriceOffer } from '@/models';

interface SearchStoreState {
  selectedDestination: GeoEntity | null;
  isLoading: boolean;
  error: string | null;
  prices: PriceOffer[];
  hasSearched: boolean;
  setDestination: (destination: GeoEntity | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPrices: (prices: PriceOffer[]) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStoreState>((set) => ({
  selectedDestination: null,
  isLoading: false,
  error: null,
  prices: [],
  hasSearched: false,
  setDestination: (destination) => {
    set({ selectedDestination: destination });
  },
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  setError: (error) => {
    set({ error, isLoading: false });
  },
  setPrices: (prices) => {
    set({ prices, isLoading: false, error: null, hasSearched: true });
  },
  reset: () => {
    set({
      isLoading: false,
      error: null,
      prices: [],
      hasSearched: false,
    });
  },
}));
