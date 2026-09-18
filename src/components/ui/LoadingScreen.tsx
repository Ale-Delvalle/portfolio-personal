import styles from './LoadingScreen.module.css';

import { useLanguage } from '../../context/LanguageContext';

interface LoadingScreenProps {
  exiting: boolean;
}

export function LoadingScreen({ exiting }: LoadingScreenProps) {
  const { t } = useLanguage();

  return (
    <div className={`${styles.screen} ${exiting ? styles.exiting : ''}`} aria-hidden={exiting}>
      <span className={styles.label}>{t.loadingScreen.label}</span>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
    </div>
  );
}
