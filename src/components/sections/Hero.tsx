
import { HeroText } from './HeroText';
import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <main className={`${styles.main} hero-mesh-gradient`}>
      <div className={styles.grid}>
        <div className={styles.spacer}></div>
        <div className={styles.col2}>
          <HeroText />
        </div>
        <div className={styles.col3}>
          <HeroPortrait />
        </div>
        <div className={styles.spacer}></div>
      </div>
      <div className={styles.meshBottom}></div>
    </main>
  );
}
