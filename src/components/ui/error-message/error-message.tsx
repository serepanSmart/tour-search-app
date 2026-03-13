import styles from './error-message.module.css';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({
  message,
}: ErrorMessageProps): React.ReactElement => (
  <div className={styles.error}>{message}</div>
);
