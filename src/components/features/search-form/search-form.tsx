import { useShallow } from 'zustand/shallow';
import { Combobox } from '@/components/composite/combobox';
import { GeoOption } from '@/components/composite/geo-option';
import { Button } from '@/components/ui/button';
import { useCountries, useSearchGeo } from '@/queries';
import { useSearchStore } from '@/stores';
import type { GeoEntity } from '@/models';
import styles from './search-form.module.css';
import { commonCardClass } from '@/constants';

interface SearchFormProps {
  onSearch: (entity: GeoEntity) => void;
  isSearching: boolean;
  onParamsChange: () => void;
}

const classes = [styles.form, commonCardClass].join(' ');

export const SearchForm = ({
  onSearch,
  isSearching,
  onParamsChange,
}: SearchFormProps): React.ReactElement => {
  const { selectedDestination, inputValue, setDestination, setInputValue } =
    useSearchStore(
      useShallow((state) => ({
        selectedDestination: state.selectedDestination,
        inputValue: state.inputValue,
        setDestination: state.setDestination,
        setInputValue: state.setInputValue,
      }))
    );

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
    !inputValue.length &&
    (!selectedDestination || selectedDestination.type === 'country');

  const options = shouldShowCountries ? countries : searchOptions;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (selectedDestination) {
      onSearch(selectedDestination);
    }
  };

  const handleInputChange = (val: string): void => {
    setInputValue(val);
    onParamsChange();
  };

  const handleValueChange = (val: GeoEntity | null): void => {
    setDestination(val);
    onParamsChange();
  };

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Форма пошуку турів</h1>
      <Combobox
        value={selectedDestination}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onValueChange={handleValueChange}
        options={options}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        renderOption={(option) => <GeoOption entity={option} />}
        placeholder="Оберіть напрямок"
      />
      <Button
        type="submit"
        fullWidth
        disabled={!selectedDestination || isSearching}
      >
        {isSearching ? 'Пошук...' : 'Знайти'}
      </Button>
    </form>
  );
};
