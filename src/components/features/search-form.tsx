import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { Combobox } from '@/components/composite/combobox';
import { GeoOption } from '@/components/composite/geo-option';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import { ToursList } from '@/components/features/tours-list';
import { useCountries, useSearchGeo } from '@/queries';
import { useEnrichedTours } from '@/hooks/use-enriched-tours';
import { useSearchPrices } from '@/hooks';
import { useSearchStore } from '@/stores';
import styles from './search-form.module.css';

export const SearchForm = (): React.ReactElement => {
  const [inputValue, setInputValue] = useState('');
  const {
    selectedDestination,
    setDestination,
    isLoading,
    error,
    prices,
    hasSearched,
    lastSearchCountryId,
    setLastSearchCountryId,
  } = useSearchStore(
    useShallow((state) => ({
      selectedDestination: state.selectedDestination,
      setDestination: state.setDestination,
      isLoading: state.isLoading,
      error: state.error,
      prices: state.prices,
      hasSearched: state.hasSearched,
      lastSearchCountryId: state.lastSearchCountryId,
      setLastSearchCountryId: state.setLastSearchCountryId,
    }))
  );

  const { startSearch } = useSearchPrices();

  const { data: countriesMap } = useCountries();
  const { data: searchResults } = useSearchGeo(inputValue, {
    enabled: !!inputValue.length,
  });

  const countries = countriesMap
    ? Object.values(countriesMap).map((c) => ({
        ...c,
        type: 'country' as const,
      }))
    : [];
  const searchOptions = searchResults ? Object.values(searchResults) : [];

  const shouldShowCountries =
    !inputValue.length || selectedDestination?.type === 'country';
  const options = shouldShowCountries ? countries : searchOptions;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (selectedDestination?.type === 'country') {
      void startSearch(selectedDestination.id);
      setLastSearchCountryId(selectedDestination.id);
    }
  };

  const enrichedTours = useEnrichedTours(
    prices,
    lastSearchCountryId ?? undefined
  );

  const noResults =
    hasSearched && !enrichedTours.length && !isLoading && !error;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Форма пошуку турів</h1>
        <Combobox
          value={selectedDestination}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onValueChange={setDestination}
          options={options}
          getOptionLabel={(option) => option.name}
          getOptionKey={(option) => option.id}
          renderOption={(option) => <GeoOption entity={option} />}
          placeholder="Оберіть напрямок"
          onEnterWhenValue={handleSubmit}
        />
        <Button
          type="submit"
          fullWidth
          disabled={!selectedDestination || isLoading}
        >
          {isLoading ? 'Пошук...' : 'Знайти'}
        </Button>
      </form>
      {isLoading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {noResults && <EmptyState />}
      {!!enrichedTours.length && <ToursList tours={enrichedTours} />}
    </div>
  );
};
