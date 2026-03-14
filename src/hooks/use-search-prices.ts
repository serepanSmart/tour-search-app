import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { searchService } from '@/services';
import { useSearchStore } from '@/stores';

const getParamsHash = (countryID: string | null | undefined): string =>
  countryID ?? 'none';

interface UseSearchPricesReturn {
  startSearch: (countryID: string) => Promise<void>;
  cancelSearch: () => Promise<void>;
  onParamsChanged: () => void;
  isSearching: boolean;
  isCancelling: boolean;
}

export const useSearchPrices = (): UseSearchPricesReturn => {
  const {
    setLoading,
    setError,
    setPrices,
    reset,
    setActiveSearchToken,
    setIsSearching,
    setIsCancelling,
    setParamsHash,
    activeSearchToken,
    isSearching,
    isCancelling,
    paramsHash,
  } = useSearchStore(
    useShallow((state) => ({
      setLoading: state.setLoading,
      setError: state.setError,
      setPrices: state.setPrices,
      reset: state.reset,
      setActiveSearchToken: state.setActiveSearchToken,
      setIsSearching: state.setIsSearching,
      setIsCancelling: state.setIsCancelling,
      setParamsHash: state.setParamsHash,
      activeSearchToken: state.activeSearchToken,
      isSearching: state.isSearching,
      isCancelling: state.isCancelling,
      paramsHash: state.paramsHash,
    }))
  );

  const startSearch = useCallback(
    async (countryID: string) => {
      const hash = getParamsHash(countryID);

      if (
        activeSearchToken &&
        paramsHash === hash &&
        (isSearching || isCancelling)
      ) {
        return;
      }

      if (
        activeSearchToken &&
        paramsHash !== hash &&
        (isSearching || isCancelling)
      ) {
        setIsCancelling(true);
        await searchService.cancel(activeSearchToken);
        setIsCancelling(false);
        setActiveSearchToken(null);
        setIsSearching(false);
      }

      reset();
      setLoading(true);
      setIsSearching(true);
      setParamsHash(hash);

      try {
        const { prices, token } = await searchService.search(countryID);
        setPrices(prices);
        setActiveSearchToken(token);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
        setActiveSearchToken(null);
      } finally {
        setIsSearching(false);
      }
    },
    [
      activeSearchToken,
      paramsHash,
      isSearching,
      isCancelling,
      setActiveSearchToken,
      setIsSearching,
      setIsCancelling,
      setLoading,
      setError,
      setPrices,
      reset,
      setParamsHash,
    ]
  );

  const cancelSearch = useCallback(async () => {
    if (activeSearchToken) {
      setIsCancelling(true);
      await searchService.cancel(activeSearchToken);
      setIsCancelling(false);
      setActiveSearchToken(null);
      setIsSearching(false);
      setParamsHash(null);
    }
    reset();
  }, [
    activeSearchToken,
    reset,
    setActiveSearchToken,
    setIsCancelling,
    setIsSearching,
    setParamsHash,
  ]);

  const onParamsChanged = useCallback(() => {
    setActiveSearchToken(null);
    setParamsHash(null);
    setIsCancelling(false);
    setIsSearching(false);
  }, [setActiveSearchToken, setParamsHash, setIsCancelling, setIsSearching]);

  return {
    startSearch,
    cancelSearch,
    onParamsChanged,
    isSearching,
    isCancelling,
  };
};
