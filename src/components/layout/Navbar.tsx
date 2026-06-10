import { useCallback, useState } from 'react';
// import { Moon, Sun, Menu, X } from 'lucide-react';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const NAV_ITEMS = [
  { label: 'Home',          target: 'home'      },
  { label: 'Acerca de mi',  target: 'about'     },
  { label: 'Proyectos',     target: 'proyectos' },
  { label: 'Stack',         target: 'stack'     },
] as const;

export function Navbar({ /* theme, toggleTheme */ }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
  }, []);

  return (
    <>
      <nav className={`${styles.navbar} ${isOpen ? styles.navbarOpen : ''}`}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(({ label, target }) => (
            <li key={target} className={styles.navItemDesktopOnly}>
              <button
                className={styles.link}
                onClick={() => scrollTo(target)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Funcionalidad de cambio de tema comentada para futura re-implementación
        <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        */}

        <button 
          className={styles.hamburgerBtn} 
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </nav>

      {isOpen && (
        <div className={styles.menuOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.menuContent} onClick={(e) => e.stopPropagation()}>
            <ul className={styles.mobileNavList}>
              {NAV_ITEMS.map(({ label, target }) => (
                <li key={target}>
                  <button
                    className={styles.mobileLink}
                    onClick={() => {
                      scrollTo(target);
                      setIsOpen(false);
                    }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
