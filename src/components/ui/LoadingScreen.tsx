import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  exiting: boolean;
}

export function LoadingScreen({ exiting }: LoadingScreenProps) {
  return (
    <div className={`${styles.screen} ${exiting ? styles.exiting : ''}`} aria-hidden={exiting}>
      <span className={styles.label}>Cargando experiencia...</span>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
    </div>
  );
}
