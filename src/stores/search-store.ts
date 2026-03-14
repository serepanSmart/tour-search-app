import { create } from 'zustand';
import type { GeoEntity, PriceOffer } from '@/models';

interface SearchStoreState {
  selectedDestination: GeoEntity | null;
  isLoading: boolean;
  error: string | null;
  prices: PriceOffer[];
  hasSearched: boolean;
  lastSearchCountryId: string | null;
  setLastSearchCountryId: (id: string | null) => void;

  activeSearchToken: string | null;
  setActiveSearchToken: (token: string | null) => void;

  isSearching: boolean;
  setIsSearching: (flag: boolean) => void;

  isCancelling: boolean;
  setIsCancelling: (flag: boolean) => void;

  paramsHash: string | null;
  setParamsHash: (hash: string | null) => void;

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
  lastSearchCountryId: null,
  setLastSearchCountryId: (id) => set({ lastSearchCountryId: id }),

  activeSearchToken: null,
  setActiveSearchToken: (token) => set({ activeSearchToken: token }),

  isSearching: false,
  setIsSearching: (flag) => set({ isSearching: flag }),

  isCancelling: false,
  setIsCancelling: (flag) => set({ isCancelling: flag }),

  paramsHash: null,
  setParamsHash: (hash) => set({ paramsHash: hash }),

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
      lastSearchCountryId: null,
      paramsHash: null,
      isSearching: false,
      isCancelling: false,
    });
  },
}));
