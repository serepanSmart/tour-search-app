import { create } from 'zustand';
import type { GeoEntity } from '@/models';

interface SearchStoreState {
  selectedDestination: GeoEntity | null;
  inputValue: string;
  setDestination: (destination: GeoEntity | null) => void;
  setInputValue: (value: string) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchStoreState>((set) => ({
  selectedDestination: null,
  inputValue: '',
  setDestination: (destination) => set({ selectedDestination: destination }),
  setInputValue: (value) => set({ inputValue: value }),
  reset: () => set({ selectedDestination: null, inputValue: '' }),
}));
