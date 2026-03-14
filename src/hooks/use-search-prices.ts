import { useState, useCallback } from 'react';
import { searchManager } from '@/services';
import type { EnrichedTour } from '@/models';

interface UseSearchPricesReturn {
  data: EnrichedTour[] | null;
  isLoading: boolean;
  error: string | null;
  search: (countryId: string) => Promise<void>;
  cancel: () => Promise<void>;
  reset: () => void;
}

export const useSearchPrices = (): UseSearchPricesReturn => {
  const [data, setData] = useState<EnrichedTour[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (countryId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const tours = await searchManager.search(countryId);
      setData(tours);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancel = useCallback(async () => {
    try {
      await searchManager.cancel();
      setData(null);
      setError(null);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel search');
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    searchManager.resetParams();
  }, []);

  return {
    data,
    isLoading,
    error,
    search,
    cancel,
    reset,
  };
};
