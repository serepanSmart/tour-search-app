import { Loader } from '@/components/ui/loader';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import { ToursList } from '@/components/features/tours-list';
import type { EnrichedTour } from '@/models';

interface SearchResultsProps {
  tours: EnrichedTour[] | null;
  isLoading: boolean;
  error: string | null;
}

export const SearchResults = ({
  tours = [],
  isLoading,
  error,
}: SearchResultsProps): React.ReactElement | null => {
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tours?.length) {
    return <EmptyState />;
  }

  return <ToursList tours={tours} />;
};
