import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X, Home, User, FolderKanban, Layers } from 'lucide-react';
import gsap from 'gsap';
import styles from './Navbar.module.css';
import { useLanguage } from '../../context/LanguageContext';

const NAV_ITEMS = [
  { key: 'home' as const,     target: 'home',      icon: Home        },
  { key: 'about' as const,    target: 'about',     icon: User        },
  { key: 'projects' as const, target: 'proyectos', icon: FolderKanban },
  { key: 'stack' as const,    target: 'stack',     icon: Layers      },
] as const;

export function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen]         = useState(false);
  const [activeTarget, setActiveTarget] = useState('home');
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const scrollTo = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
  }, []);

  const selectItem = useCallback((target: string) => {
    scrollTo(target);
    setIsOpen(false);
  }, [scrollTo]);

  // ── Mobile: detecta qué sección está más visible para resaltar su ítem ──
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const sectionEls = NAV_ITEMS
      .map(({ target }) => document.getElementById(target))
      .filter((el): el is HTMLElement => el !== null);

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target.id, entry.intersectionRatio));
        let bestId = '';
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestRatio > 0) setActiveTarget(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Despliegue escalonado de los ítems al abrir el menú (nace del botón) ──
  useEffect(() => {
    if (!isOpen) return;

    const items = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
    gsap.fromTo(items,
      { autoAlpha: 0, y: 24, scale: 0.85 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: { each: 0.07, from: 'end' },
        ease: 'back.out(1.7)',
      }
    );
  }, [isOpen]);

  return (
    <>
      {/* Desktop / tablet: pill de navegación de siempre */}
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(({ key, target }) => (
            <li key={target}>
              <button
                className={styles.link}
                onClick={() => scrollTo(target)}
              >
                {t.nav[key]}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: botón hamburguesa que despliega los ítems en vertical */}
      <div className={styles.fabRoot}>
        {isOpen && (
          <div className={styles.fabScrim} onClick={() => setIsOpen(false)} />
        )}

        {isOpen && (
          <div className={styles.fabItems}>
            {NAV_ITEMS.map(({ key, target, icon: Icon }, i) => (
              <button
                key={target}
                ref={(el) => { itemsRef.current[i] = el; }}
                className={`${styles.fabItem} ${activeTarget === target ? styles.fabItemActive : ''}`}
                onClick={() => selectItem(target)}
              >
                <Icon size={18} strokeWidth={2.25} />
                <span className={styles.fabLabel}>{t.nav[key]}</span>
              </button>
            ))}
          </div>
        )}

        <button
          className={styles.fabToggle}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </>
  );
}
