import type { EnrichedTour } from '@/models';
import { TourCard } from './tour-card';
import styles from './tours-list.module.css';

interface ToursListProps {
  tours: EnrichedTour[];
}

export const ToursList = ({
  tours,
}: ToursListProps): React.ReactElement | null => {
  if (!tours.length) {
    return null;
  }
  return (
    <div className={styles.grid}>
      {tours.map((tour) => (
        <TourCard tour={tour} key={tour.id} />
      ))}
    </div>
  );
};
