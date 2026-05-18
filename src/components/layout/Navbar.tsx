import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(navRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: "power3.out",
      delay: 2.5
    });
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    // GSAP ScrollTrigger puede perderse el salto instantáneo; refresh fuerza el recálculo
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <nav ref={navRef} className={styles.navbar}>
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
