import type { EnrichedTour } from '@/models';
import styles from './tour-card.module.css';

interface TourCardProps {
  tour: EnrichedTour;
}

export const TourCard = ({ tour }: TourCardProps): React.ReactElement => (
  <article className={styles.card}>
    <img src={tour.hotel.img} alt={tour.hotel.name} className={styles.img} />
    <div className={styles.info}>
      <h3 className={styles.title}>{tour.hotel.name}</h3>
      <div className={styles.meta}>
        <span className={styles.country}>
          <img
            // src={`https://flagcdn.com/w20/${tour.hotel.countryName === 'Єгипет' ? 'eg' : tour.hotel.countryName === 'Греція' ? 'gr' : 'tr'}.png`}
            alt={tour.hotel.countryName}
          />
          {tour.hotel.countryName}, {tour.hotel.cityName}
        </span>
      </div>
      <div className={styles.date}>
        Старт туру
        <br />
        {tour.startDate}
      </div>
      <div className={styles.price}>
        {tour.amount.toLocaleString()} {tour.currency.toUpperCase()}
      </div>
      <a className={styles.link} href="#">
        Відкрити ціну
      </a>
    </div>
  </article>
);
