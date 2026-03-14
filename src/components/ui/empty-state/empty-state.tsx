import { commonCardClass } from '@/constants';
import styles from './empty-state.module.css';

interface EmptyStateProps {
  message?: string;
}

const classes = [styles.empty, commonCardClass].join(' ');

export const EmptyState = ({
  message = 'За вашим запитом турів не знайдено',
}: EmptyStateProps): React.ReactElement => (
  <div className={classes}>{message}</div>
);
