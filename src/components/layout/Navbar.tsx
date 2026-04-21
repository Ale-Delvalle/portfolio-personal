
import { Code, Terminal, Moon, Sun } from 'lucide-react';
import { GlassContainer } from '../ui/GlassContainer';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  return (
    <GlassContainer className={styles.navbarWrapper}>
      <div className={styles.brand}>Architect</div>
      
      <div className={styles.links}>
        <a href="#work" className={`${styles.link} ${styles.activeLink}`}>Work</a>
        <a href="#expertise" className={styles.link}>Expertise</a>
        <a href="#experience" className={styles.link}>Experience</a>
        <a href="#inquiry" className={styles.link}>Inquiry</a>
      </div>

      <div className={styles.icons}>
        <button className={styles.iconBtn} aria-label="Code">
          <Code size={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Terminal">
          <Terminal size={20} />
        </button>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </GlassContainer>
  );
}
