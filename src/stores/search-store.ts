import { create } from 'zustand';
import type { GeoEntity } from '@/models';

interface SearchState {
  selectedDestination: GeoEntity | null;
  setDestination: (destination: GeoEntity | null) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  selectedDestination: null,
  setDestination: (destination) => {
    set({ selectedDestination: destination });
  },
}));
