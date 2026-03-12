import type { GeoEntity } from '@/models';
import styles from './geo-option.module.css';

interface GeoOptionProps {
  entity: GeoEntity;
}

const getIcon = (type: GeoEntity['type']): string => {
  switch (type) {
    case 'country':
      return '🏳️';
    case 'city':
      return '📍';
    case 'hotel':
      return '🏨';
  }
};

export const GeoOption = ({ entity }: GeoOptionProps): React.ReactElement => {
  const icon =
    entity.type === 'country' ? (
      <img src={entity.flag} alt={entity.name} className={styles.flag} />
    ) : (
      <span className={styles.icon}>{getIcon(entity.type)}</span>
    );

  return (
    <div className={styles.option}>
      {icon}
      <span className={styles.name}>{entity.name}</span>
    </div>
  );
};
