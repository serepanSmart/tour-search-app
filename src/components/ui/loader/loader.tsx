import styles from './loader.module.css';

export const Loader = (): React.ReactElement => (
  <div className={styles.loader}>
    <span className={styles.spinner} />
    <p className={styles.text}>Пошук турів...</p>
  </div>
);
