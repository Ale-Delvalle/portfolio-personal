
import styles from './HeroText.module.css';

export function HeroText() {
  return (
    <div className={styles.container}>
      <div data-gsap="title" className={styles.titleWrapper}>
        <span className={styles.label}>Creative Engineer</span>
        <h1 className={styles.title}>
          Building <span className={styles.gradientText}>Digital Solutions</span>
        </h1>
      </div>

      <p data-gsap="description" className={styles.description}>
        Synthesizing rigid structural logic with fluid creative expression. Architecting scalable interfaces that bridge the gap between human intuition and machine precision.
      </p>

      <div data-gsap="action" className={styles.actionRow}>
        <button className={styles.button}>View Projects</button>
        <div className="editorial-line" style={{ flex: 1 }}></div>
      </div>
    </div>
  );
}
