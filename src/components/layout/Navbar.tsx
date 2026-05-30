import { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NAV_ITEMS = [
  { label: 'Home',      target: 'home'      },
  { label: 'Proyectos', target: 'proyectos' },
  { label: 'Stack',     target: 'stack'     },
] as const;

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const scrollTo = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
  }, []);

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {NAV_ITEMS.map(({ label, target }) => (
          <li key={target}>
            <button
              className={styles.link}
              onClick={() => scrollTo(target)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </nav>
  );
}
