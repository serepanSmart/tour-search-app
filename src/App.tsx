import { useSearchPrices } from '@/hooks';
import { SearchForm } from '@/components/features/search-form';
import { SearchResults } from '@/components/features/search-results';
import type { GeoEntity } from '@/models';
import styles from './app.module.css';

export const App = (): React.ReactElement => {
  const { data, isLoading, error, search, cancel } = useSearchPrices();

  const handleSearch = (entity: GeoEntity): void => {
    void search(entity);
  };

  const handleParamsChange = (): void => {
    if (isLoading) {
      void cancel();
    }
  };

  return (
    <div className={styles.app}>
      <SearchForm
        onSearch={handleSearch}
        isSearching={isLoading}
        onParamsChange={handleParamsChange}
      />
      <SearchResults tours={data} isLoading={isLoading} error={error} />
    </div>
  );
};
