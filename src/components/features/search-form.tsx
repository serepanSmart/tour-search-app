import { useState } from 'react';
import { Combobox } from '@/components/composite/combobox';
import { GeoOption } from '@/components/composite/geo-option';
import { Button } from '@/components/ui/button';
import { useCountries, useSearchGeo } from '@/queries';
import { useSearchStore } from '@/stores';
import styles from './search-form.module.css';

export const SearchForm = (): React.ReactElement => {
  const [inputValue, setInputValue] = useState('');
  const { selectedDestination, setDestination } = useSearchStore();

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
      console.warn('TODO: Start search for country:', selectedDestination.id);
    }
  };

  return (
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
      />
      <Button type="submit" fullWidth disabled={!selectedDestination}>
        Знайти
      </Button>
    </form>
  );
};
