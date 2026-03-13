import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { searchService } from '@/services';
import { useSearchStore } from '@/stores';

interface UseSearchPricesReturn {
  startSearch: (countryID: string) => Promise<void>;
  cancelSearch: () => void;
}

export const useSearchPrices = (): UseSearchPricesReturn => {
  const { setLoading, setError, setPrices, reset } = useSearchStore(
    useShallow((state) => ({
      setLoading: state.setLoading,
      setError: state.setError,
      setPrices: state.setPrices,
      reset: state.reset,
    }))
  );

  const startSearch = useCallback(
    async (countryID: string): Promise<void> => {
      reset();
      setLoading(true);

      try {
        const prices = await searchService.search(countryID);
        setPrices(prices);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error occurred');
        }
      }
    },
    [reset, setLoading, setPrices, setError]
  );

  const cancelSearch = useCallback((): void => {
    searchService.cancel();
    reset();
  }, [reset]);

  return { startSearch, cancelSearch };
};
