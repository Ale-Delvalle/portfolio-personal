
import { Navbar } from './components/layout/Navbar';
import { GlowBackground } from './components/layout/GlowBackground';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Stack } from './components/sections/Stack';
import { Projects } from './components/sections/Projects';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { LanguageToggle } from './components/ui/LanguageToggle';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePerformanceTier } from './context/PerformanceContext';
import { getDeviceHints } from './lib/performanceTier';
import { isPhoneViewport, detectLowEndPhone, logMobileIntroDecision } from './lib/mobileIntroSkip';

gsap.registerPlugin(ScrollTrigger);

// Tiempo mínimo que se muestra la pantalla de carga para evitar un parpadeo
// cuando los recursos ya están en caché y cargan casi instantáneamente.
const MIN_LOADING_SCREEN_MS = 500;
const LOADING_SCREEN_FADE_MS = 500;

function App() {
  const isAnimating   = useRef(false);
  const activeIndexRef = useRef(0);

  const { tier } = usePerformanceTier();
  // Se congela en el primer render: la pantalla de carga solo aplica a la
  // estimación inmediata (heurística de cores/memoria), no a la medición de
  // FPS que llega ~1.2s después y que no debe alterar esta decisión inicial.
  // En desktop solo se activa para el tier 'high'; en mobile se activa siempre
  // (isMobile hace que el tier nunca llegue a 'high', así que se chequea aparte).
  const [showLoadingGate] = useState(() => tier === 'high' || getDeviceHints().isMobile);
  const [introReady, setIntroReady] = useState(!showLoadingGate);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(showLoadingGate);
  // Se congela en el primer render, igual que showLoadingGate.
  const [isPhone] = useState(() => isPhoneViewport());
  const [skipMobileIntro, setSkipMobileIntro] = useState(false);

  useEffect(() => {
    if (!showLoadingGate) return;

    // Solo celulares (no tablet ni PC): se corre un benchmark real de dibujo
    // para decidir si el equipo aguanta la intro animada. No toca ni depende
    // del sistema de tiers de performanceTier.ts, que sigue intacto para
    // tablet/PC. Corre oculto detrás de la pantalla de carga.
    if (isPhone) {
      const decision = detectLowEndPhone();
      logMobileIntroDecision(decision);
      setSkipMobileIntro(decision.skipIntro);
    }

    const start = performance.now();
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const windowLoaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }));

    Promise.all([fontsReady, windowLoaded]).then(() => {
      const remaining = Math.max(0, MIN_LOADING_SCREEN_MS - (performance.now() - start));
      setTimeout(() => {
        setIntroReady(true);
        setLoaderExiting(true);
        setTimeout(() => setLoaderMounted(false), LOADING_SCREEN_FADE_MS);
      }, remaining);
    });
  }, [showLoadingGate, isPhone]);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      setTimeout(onLoad, 100);
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }
  }, []);

  useEffect(() => {
    // Disable native scroll restoration to avoid weird jumps on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const sections = ['home', 'about', 'proyectos', 'stack'];
    
    // Maintain the active index across events
    const initialScroll = window.scrollY;
    activeIndexRef.current = Math.round(initialScroll / window.innerHeight);

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;
      if (isAnimating.current) return;
      
      // Si la galería está abierta, evitamos que cualquier scroll fuera del contenedor propague y mueva el fondo
      if (document.body.style.overflow === 'hidden') {
        const path = e.composedPath();
        const isScrollArea = path.some(el => {
          if (el instanceof HTMLElement) {
            return el.className.includes('detailScrollArea');
          }
          return false;
        });
        if (!isScrollArea) {
          e.preventDefault();
        }
        return;
      }
      const direction = Math.sign(e.deltaY);
      if (direction === 0) return;

      if (e.preventDefault) {
        e.preventDefault();
      }

      let nextIndex = activeIndexRef.current + direction;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sections.length) nextIndex = sections.length - 1;

      if (activeIndexRef.current === nextIndex) return;

      navigateToSection(sections[activeIndexRef.current], sections[nextIndex]);
    };

    const handleScroll = () => {
      // Si la galería o algún overlay está abierto, ignoramos
      if (document.body.style.overflow === 'hidden') return;
      // Si estamos en medio de una transición nuestra, ignoramos
      if (isAnimating.current) return;

      // Simplemente mantenemos el índice actualizado para que si luego
      // usan la rueda del ratón, empiece desde la sección correcta.
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      activeIndexRef.current = Math.round(currentScroll / windowHeight);
    };

    const navigateToSection = (currentSectionId: string, nextSectionId: string) => {
      if (isAnimating.current) return;
      if (currentSectionId === nextSectionId) return;

      isAnimating.current = true;
      activeIndexRef.current = sections.indexOf(nextSectionId);

      const currentEl = document.getElementById(currentSectionId);
      const nextEl = document.getElementById(nextSectionId);

      if (currentEl && nextEl) {
        // 1) El contenido viejo desaparece
        gsap.to(currentEl, { 
          autoAlpha: 0, 
          duration: 0.2, 
          onComplete: () => {
            // 2) Pequeño espacio en negro (decimas de segundo)
            setTimeout(() => {
              // 3) Justo por debajo del Navbar se renderiza la siguiente sección
              nextEl.scrollIntoView({ behavior: 'instant', block: 'start' });

              // Refrescar ScrollTrigger para que las animaciones internas se disparen
              ScrollTrigger.refresh();

              // Asegurarnos de que la nueva sección sea visible
              gsap.set(nextEl, { autoAlpha: 1 });

              // Notificar a las secciones qué sección acaba de volverse activa
              window.dispatchEvent(new CustomEvent('section-entered', { detail: { id: nextSectionId } }));
              
              // Liberar el bloqueo
              setTimeout(() => {
                // Restauramos la visibilidad de la sección anterior "detrás de cámaras"
                // para que si el usuario usa el scroll nativo, no vea una pantalla negra
                gsap.set(currentEl, { autoAlpha: 1 });
                isAnimating.current = false;
              }, 400); // cooldown de trackpad
            }, 100);
          }
        });
      } else {
        isAnimating.current = false;
      }
    };

    const handleNavClick = (e: CustomEvent<{ id: string }>) => {
      const targetId = e.detail.id;
      if (window.innerWidth < 1024) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          activeIndexRef.current = sections.indexOf(targetId);
        }
      } else {
        navigateToSection(sections[activeIndexRef.current], targetId);
      }
    };

    window.addEventListener('navigate', handleNavClick as EventListener);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: false });

    // Handle touch swipe for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth < 1024) return;
      if (document.body.style.overflow === 'hidden') return;
      if (isAnimating.current) {
        e.preventDefault();
        return;
      }
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      
      if (Math.abs(deltaY) > 50) { // swipe threshold
        handleWheel({ deltaY } as any);
        touchStartY = touchEndY; // reset to prevent multiple triggers
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('navigate', handleNavClick as EventListener);
    };
  }, []);

  return (
    <>
      {loaderMounted && <LoadingScreen exiting={loaderExiting} />}
      <LanguageToggle />
      <GlowBackground />
      <Navbar />
      <Hero introReady={introReady} skipIntroAnimation={skipMobileIntro} />
      <About />
      <Projects />
      <Stack />
    </>
  );
}

export default App;
