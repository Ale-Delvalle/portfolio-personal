
import { Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>Alexis</div>

      <ul className={styles.navList}>
        <li>
          <a href="#work" className={`${styles.link} ${styles.activeLink}`}>Work</a>
        </li>
        <li>
          <a href="#expertise" className={styles.link}>Expertise</a>
        </li>
        <li>
          <a href="#experience" className={styles.link}>Experience</a>
        </li>
        <li>
          <a href="#inquiry" className={styles.link}>Inquiry</a>
        </li>
      </ul>

      <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </nav>
  );
}
