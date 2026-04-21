
import styles from './HeroText.module.css';

export function HeroText() {
  return (
    <div className={styles.container}>
      <div className={`${styles.titleWrapper} animate-fade-up`}>
        <span className={styles.label}>Creative Engineer</span>
        <h1 className={styles.title}>
          Building <span className={styles.gradientText}>Digital Solutions</span>
        </h1>
      </div>
      
      <p className={`${styles.description} animate-fade-up delay-100`}>
        Synthesizing rigid structural logic with fluid creative expression. Architecting scalable interfaces that bridge the gap between human intuition and machine precision.
      </p>
      
      <div className={`${styles.actionRow} animate-fade-up delay-200`}>
        <button className={styles.button}>View Projects</button>
        <div className="editorial-line" style={{ flex: 1 }}></div>
      </div>
    </div>
  );
}
