import { commonCardClass } from '@/constants';
import styles from './loader.module.css';

const classes = [styles.loader, commonCardClass].join(' ');

export const Loader = (): React.ReactElement => (
  <div className={classes}>
    <span className={styles.spinner} />
    <p className={styles.text}>Пошук турів...</p>
  </div>
);
