import { useSearchPrices } from '@/hooks';
import { SearchForm } from '@/components/features/search-form';
import { SearchResults } from '@/components/features/search-results';

export const App = (): React.ReactElement => {
  const { data, isLoading, error, search, reset } = useSearchPrices();

  const handleSearch = (countryId: string): void => {
    void search(countryId);
  };

  const handleParamsChange = (): void => {
    reset();
  };

  return (
    <>
      <SearchForm
        onSearch={handleSearch}
        isSearching={isLoading}
        onParamsChange={handleParamsChange}
      />
      <SearchResults tours={data} isLoading={isLoading} error={error} />
    </>
  );
};
