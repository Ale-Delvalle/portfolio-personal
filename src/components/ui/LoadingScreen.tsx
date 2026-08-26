import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
  exiting: boolean;
}

export function LoadingScreen({ exiting }: LoadingScreenProps) {
  return (
    <div className={`${styles.screen} ${exiting ? styles.exiting : ''}`} aria-hidden={exiting}>
      <span className={styles.monogram}>Bienvenido a mi portfolio!</span>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      <span className={styles.label}>Cargando experiencia...</span>
    </div>
  );
}
