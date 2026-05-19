
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { GlowBackground } from './components/layout/GlowBackground';
import { Hero } from './components/sections/Hero';
import { Stack } from './components/sections/Stack';
// import { Projects } from './components/sections/Projects';
// import { ProjectsV1 } from './components/sections/ProjectsV1';
import { ProjectsV2 } from './components/sections/ProjectsV2';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const { theme, toggleTheme } = useTheme();
  const isAnimating = useRef(false);

  useEffect(() => {
    // Disable native scroll restoration to avoid weird jumps on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const sections = ['home', 'proyectos', 'stack'];
    
    // Ocultar scrollbar porque controlaremos el scroll manualmente
    document.body.style.overflow = 'hidden';

    const handleWheel = (e: WheelEvent) => {
      // Si hay un modal abierto (como el detalle del proyecto) que ya ocultó el overflow, no hacemos nada
      // O si estamos en medio de una transición, ignoramos
      if (isAnimating.current) return;

      const direction = Math.sign(e.deltaY);
      if (direction === 0) return;

      // Buscar en qué sección estamos basados en el scroll actual
      const currentScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentIndex = Math.round(currentScroll / windowHeight);

      let nextIndex = currentIndex + direction;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sections.length) nextIndex = sections.length - 1;

      if (currentIndex === nextIndex) return;

      isAnimating.current = true;

      const currentSectionId = sections[currentIndex];
      const nextSectionId = sections[nextIndex];

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
              
              // Liberar el bloqueo
              setTimeout(() => {
                isAnimating.current = false;
              }, 400); // cooldown de trackpad
            }, 100);
          }
        });
      } else {
        isAnimating.current = false;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Handle touch swipe for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
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
      document.body.style.overflow = '';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <>
      <GlowBackground />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      {/* <Projects /> */}
      {/* <ProjectsV1 /> */}
      <ProjectsV2 />
      <Stack />
    </>
  );
}

export default App;
