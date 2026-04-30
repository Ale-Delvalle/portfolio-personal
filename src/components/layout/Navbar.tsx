import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Moon, Sun } from 'lucide-react';
import styles from './Navbar.module.css';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Sincronizado (2.5s) con la aparición de los textos laterales en el Hero
    gsap.from(navRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: "power3.out",
      delay: 2.5
    });
  }, []);

  return (
    <nav ref={navRef} className={styles.navbar}>
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
