import styles from './empty-state.module.css';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({
  message = 'За вашим запитом турів не знайдено',
}: EmptyStateProps): React.ReactElement => (
  <div className={styles.empty}>{message}</div>
);
