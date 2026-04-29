
import styles from './HeroText.module.css';

export function HeroText() {
  return (
    <div className={styles.container}>
      <div data-gsap="title" className={styles.titleWrapper}>
        <h1 className={styles.title}>
          Alexis <span className={styles.gradientText}>Delvalle</span>
        </h1>
        <span className={styles.label}>Fullstack Developer</span>
      </div>

      <p data-gsap="description" className={styles.description}>
        Me apasiona construir experiencias de usuario intuitivas, eficientes y escalables.
      </p>

      <div data-gsap="action" className={styles.actionRow}>
        <button className={styles.button}>View Projects</button>
        <div className="editorial-line" style={{ flex: 1 }}></div>
      </div>
    </div>
  );
}
