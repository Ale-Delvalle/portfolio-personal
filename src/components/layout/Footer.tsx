
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>THE LUMINOUS ARCHITECT</div>
        
        <div className={styles.links}>
          <a href="#github" className={styles.link}>Github</a>
          <a href="#linkedin" className={styles.link}>LinkedIn</a>
          <a href="#mail" className={styles.link}>Mail</a>
        </div>
        
        <div className={styles.copyright}>
          © 2024 THE LUMINOUS ARCHITECT. ENGINEERED FOR PRECISION.
        </div>
      </div>
    </footer>
  );
}
