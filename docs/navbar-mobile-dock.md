# Navbar mobile — diseño "Dock inferior estilo app"

Snapshot del diseño de navbar mobile (`< 768px`) implementado el 2026-07-23,
guardado para poder restaurarlo si se reemplaza por otra alternativa (p. ej.
el "overlay cinematográfico").

## Resumen

Barra flotante fija abajo, centrada, con 4 botones (ícono + label): Home,
Acerca de mi, Proyectos, Stack. Una píldora con gradiente naranja
(`.dockIndicator`) se desliza con GSAP detrás del ícono de la sección activa.
La sección activa se detecta con un `IntersectionObserver` sobre las 4
secciones (`#home`, `#about`, `#proyectos`, `#stack`) mientras el usuario
scrollea.

En `>= 768px` (tablet/desktop) no cambia nada: sigue el `.navbar` pill de
siempre con `.navList` en fila.

## Componente — `src/components/layout/Navbar.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { Home, User, FolderKanban, Layers } from 'lucide-react';
import gsap from 'gsap';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { label: 'Home',          target: 'home',      icon: Home        },
  { label: 'Acerca de mi',  target: 'about',     icon: User        },
  { label: 'Proyectos',     target: 'proyectos', icon: FolderKanban },
  { label: 'Stack',         target: 'stack',     icon: Layers      },
] as const;

export function Navbar() {
  const dockRef      = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dockItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeTarget, setActiveTarget] = useState<string>('home');

  const scrollTo = useCallback((id: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
  }, []);

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

  // ── Desliza el indicador brillante hacia el ítem activo ──
  const hasPositionedRef = useRef(false);
  useEffect(() => {
    const dock  = dockRef.current;
    const glow  = indicatorRef.current;
    const index = NAV_ITEMS.findIndex((item) => item.target === activeTarget);
    const item  = dockItemsRef.current[index];
    if (!dock || !glow || !item) return;

    const dockRect = dock.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const x = itemRect.left - dockRect.left;

    if (!hasPositionedRef.current) {
      hasPositionedRef.current = true;
      gsap.set(glow, { x, width: itemRect.width });
      return;
    }

    gsap.to(glow, { x, width: itemRect.width, duration: 0.5, ease: 'power3.out' });
  }, [activeTarget]);

  return (
    <>
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
      </nav>

      <nav ref={dockRef} className={styles.mobileDock}>
        <div ref={indicatorRef} className={styles.dockIndicator} aria-hidden="true" />
        {NAV_ITEMS.map(({ label, target, icon: Icon }, i) => (
          <button
            key={target}
            ref={(el) => { dockItemsRef.current[i] = el; }}
            className={`${styles.dockItem} ${activeTarget === target ? styles.dockItemActive : ''}`}
            onClick={() => scrollTo(target)}
            aria-label={label}
          >
            <Icon size={20} strokeWidth={2.25} />
            <span className={styles.dockLabel}>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
```

## Estilos — bloques relevantes de `src/components/layout/Navbar.module.css`

Estos son los bloques que hay que reinsertar en el módulo (reemplazando lo
que exista en `.mobileDock`, `.dockIndicator`, `.dockItem`, `.dockLabel`,
`.dockItemActive` y el media query mobile) para restaurar este diseño:

```css
/* ── Dock inferior (mobile) ──────────────────────── */
.mobileDock {
  display: none;
  position: fixed;
  bottom: 1.1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  align-items: center;
  gap: 0.1rem;
  padding: 0.45rem;
  border-radius: 22px;
  background: rgba(12, 14, 17, 0.78);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 167, 38, 0.28);
  box-shadow: 0 10px 34px rgba(0, 0, 0, 0.45), 0 0 22px rgba(255, 107, 0, 0.18);
  animation: fadeInNavbar 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.dockIndicator {
  position: absolute;
  top: 0.45rem;
  bottom: 0.45rem;
  left: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #FFD180 0%, #FFA726 50%, #FF6B00 100%);
  box-shadow: 0 0 18px rgba(255, 107, 0, 0.55), 0 0 6px rgba(255, 209, 128, 0.6);
  z-index: 0;
}

.dockItem {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  min-width: 62px;
  padding: 0.4rem 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(232, 160, 96, 0.65);
  transition: color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}

.dockLabel {
  font-family: "Inter", sans-serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.dockItemActive {
  color: #1a1006;
}

@keyframes fadeInNavbar {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

Y el media query mobile:

```css
/* --- MOBILE (< 768px) --- */
@media (max-width: 767px) {
  .navbar {
    display: none !important;
  }

  .mobileDock {
    display: flex;
  }
}
```

## Notas de diseño

- Paleta del gradiente de la píldora: `#FFD180 → #FFA726 → #FF6B00` (135deg),
  consistente con el resto del sitio (glare de `Projects.tsx`, tags de
  proyectos, etc.).
- El ítem activo usa texto casi negro (`#1a1006`) para contrastar contra la
  píldora brillante, en vez de aclarar el texto (que perdería contraste
  sobre un fondo naranja claro).
- Los 4 ítems tienen ancho fijo (`min-width: 62px`) con ícono + label
  siempre visibles — se evitó variar el ancho del botón activo para no
  generar una carrera entre el resize del botón (transición CSS) y el
  cálculo de posición del indicador (leído vía `getBoundingClientRect` en
  JS), que dependen de layouts estables.
- Detección de sección activa: igual que el resto del proyecto (ver
  `About.tsx`, `Projects.tsx`), el breakpoint mobile se chequea una sola vez
  al montar el efecto (`window.innerWidth` en el `useEffect`), sin
  reaccionar a resize — convención ya usada en todo el codebase.
- Iconos: `lucide-react` — `Home`, `User`, `FolderKanban`, `Layers`.
