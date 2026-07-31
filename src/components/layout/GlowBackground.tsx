import { useRef, useEffect } from 'react';
import styles from './GlowBackground.module.css';
import { usePerformanceTier } from '../../context/PerformanceContext';
import type { PerformanceTier } from '../../lib/performanceTier';

export function GlowBackground({ isGallery = false, active = true }: { isGallery?: boolean; active?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = usePerformanceTier();
  // Refleja el tier (estimación inmediata de fase 1, corregida por la medición
  // real de fase 2) desde el frame 1 — el intro es lo primero que se dibuja y
  // en una PC lenta no puede esperar 1.2s a la medición para aliviar el costo.
  // Se lee por-frame vía ref, nunca como dependencia del efecto de abajo, así
  // que la corrección de fase 2 es suave y no reinicia la animación del canvas
  // (eso es lo que reseteaba la transición del intro a mitad de camino).
  const tierRef = useRef<PerformanceTier>(tier);

  useEffect(() => {
    tierRef.current = tier;
  }, [tier]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Los orbes/glows se dibujan a baja resolución en este canvas auxiliar y
    // se desenfocan ahí (ctx.filter blur es caro en proporción a la cantidad
    // de píxeles procesados). Luego se escalan al canvas principal con un
    // drawImage simple, que es barato. Misma apariencia, muchísimo menos costo.
    const BLUR_DOWNSCALE = 4;
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    let width = 0;
    let height = 0;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      offCanvas.width = Math.max(1, Math.round(width / BLUR_DOWNSCALE));
      offCanvas.height = Math.max(1, Math.round(height / BLUR_DOWNSCALE));
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let orbTime = 0;
    let waveTime = 0;
    let rafId: number;

    let orbAlpha = isGallery ? 0 : 1;
    let heroOrbAlpha = isGallery ? 1 : 0;
    let transitionStarted = isGallery;

    let scrollEnergy = 0;
    let scrollOrbTime = 0;
    let mobileOrbRamp = 0;
    let scrollTimeoutId: any = null;
    let isScrolling = false;

    const handleTransition = () => {
      transitionStarted = true;
    };

    const isMobile = () => window.innerWidth < 1024;

    const handleScroll = () => {
      if (transitionStarted && (!isMobile() || isGallery)) {
        if (!isGallery) {
          scrollEnergy = Math.min(1, scrollEnergy + 0.35);
        } else {
          isScrolling = true;
          if (scrollTimeoutId) window.clearTimeout(scrollTimeoutId);
          scrollTimeoutId = window.setTimeout(() => {
            isScrolling = false;
          }, 300);
        }
      }
    };

    window.addEventListener('hero-move-up', handleTransition);
    window.addEventListener('scroll', handleScroll, true);

    // Mobile: disparar una vez por sección cuando el 40% es visible
    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && isMobile()) {
          mobileOrbRamp = 56; // ~56 frames ≈ 1s de fade-in
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-section-trigger]').forEach(el => titleObserver.observe(el));

    const mobileWidth = isMobile();
    // "lightweight" = renderizado liviano: pantalla chica O tier confirmado no-alto.
    // Se reevalúa en cada frame (ver animate) leyendo tierRef, así que un cambio de
    // tier ajusta la calidad sin reiniciar el canvas ni el estado de la animación.
    let lightweight = mobileWidth || tierRef.current !== 'high';
    let lowTier = tierRef.current === 'low';

    // Dibuja una capa de "glow" desenfocada. En desktop, dibuja a baja
    // resolución en el canvas auxiliar (con el blur ya aplicado ahí, donde
    // es barato) y luego la escala al canvas principal. En mobile no había
    // blur antes tampoco, así que se dibuja directo sin cambios de comportamiento.
    const drawGlowLayer = (
      draw: (octx: CanvasRenderingContext2D, scale: number) => void,
      blurPx: number,
      alpha: number,
      compositeOp: GlobalCompositeOperation = 'screen'
    ) => {
      if (alpha <= 0) return;

      if (lightweight) {
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = compositeOp;
        draw(ctx, 1);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        return;
      }

      const scale = 1 / BLUR_DOWNSCALE;
      offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
      offCtx.filter = `blur(${Math.max(1, blurPx * scale)}px)`;
      draw(offCtx, scale);
      offCtx.filter = 'none';

      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = compositeOp;
      ctx.drawImage(offCanvas, 0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const orbsFull = [
      { color: 'rgba(255, 107, 0, 0.8)', size: 0.8, speedX: 0.0006, speedY: 0.0005, phaseX: 0, phaseY: 1 },
      { color: 'rgba(255, 167, 38, 0.6)', size: 0.9, speedX: 0.0004, speedY: 0.0003, phaseX: 2, phaseY: 3 },
      { color: 'rgba(204, 68, 0, 0.9)', size: 0.7, speedX: 0.0005, speedY: 0.0006, phaseX: 4, phaseY: 5 },
      { color: 'rgba(255, 80, 0, 0.6)', size: 1.0, speedX: 0.0003, speedY: 0.0004, phaseX: 1, phaseY: 4 },
      { color: 'rgba(255, 140, 0, 0.5)', size: 0.6, speedX: 0.0007, speedY: 0.0005, phaseX: 3, phaseY: 2 }
    ];
    const orbsReduced = [orbsFull[0], orbsFull[1]];
    // Tier bajo: 2 orbes que arrancan en puntos bien distintos (uno a la derecha,
    // otro a la izquierda, no el mismo punto divergiendo con el tiempo) y con
    // radio más grande que cualquiera de los 5 originales, para compensar tener
    // solo 2 fuentes de luz y seguir iluminando gran parte de la pantalla, tal
    // como en tier alto.
    const orbsMinimal = [
      { color: 'rgba(255, 107, 0, 0.85)', size: 1.15, speedX: 0.0006, speedY: 0.0005, phaseX: 0.4, phaseY: 1 },
      { color: 'rgba(255, 167, 38, 0.75)', size: 1.15, speedX: 0.0005, speedY: 0.0004, phaseX: 3.9, phaseY: 3 }
    ];

    // Definición de las curvas de las mechas (Alta velocidad: 3 segundos por pantalla)
    const comets = [
      // Cruza de Izquierda a Derecha
      { p0: {x: -0.1, y: 0.2}, p1: {x: 0.3, y: 0.4}, p2: {x: 0.7, y: 0.1}, p3: {x: 1.1, y: 0.3}, duration: 3000 },
      // Cruza de Derecha a Izquierda
      { p0: {x: 1.1, y: 0.6}, p1: {x: 0.4, y: 0.3}, p2: {x: 0.6, y: 0.8}, p3: {x: -0.1, y: 0.5}, duration: 3000 },
      // Cruza de Izquierda a Derecha (más abajo)
      { p0: {x: -0.1, y: 0.85}, p1: {x: 0.2, y: 1.05}, p2: {x: 0.8, y: 0.6}, p3: {x: 1.1, y: 0.8}, duration: 3000 },
      // Cruza de Derecha a Izquierda (arriba)
      { p0: {x: 1.1, y: 0.1}, p1: {x: 0.4, y: -0.1}, p2: {x: 0.6, y: 0.3}, p3: {x: -0.1, y: 0.15}, duration: 3000 },
      // Camino invisible inferior para el efecto de polvo estelar / partículas
      { p0: {x: -0.1, y: 0.95}, p1: {x: 0.4, y: 1.05}, p2: {x: 0.6, y: 0.9}, p3: {x: 1.1, y: 0.95}, duration: 12000, isParticles: true }
    ];

    const getBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
      const cX = 3 * (p1.x - p0.x);
      const bX = 3 * (p2.x - p1.x) - cX;
      const aX = p3.x - p0.x - cX - bX;
      const x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;

      const cY = 3 * (p1.y - p0.y);
      const bY = 3 * (p2.y - p1.y) - cY;
      const aY = p3.y - p0.y - cY - bY;
      const y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

      return { x, y };
    };

    // const particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];
    
    // Variables para el control de "Bursts" (Ráfagas) y Pausas de 10s
    let globalTimer = 0;
    let currentBurstIndices = [0, 1, 2];
    let frameCount = 0;

    const shuffle = (array: number[]) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };

    const animate = () => {
      lightweight = mobileWidth || tierRef.current !== 'high';
      lowTier = tierRef.current === 'low';

      time += 16;
      globalTimer += 16;
      waveTime += 0.007;
      if (!isGallery || isScrolling) {
        scrollOrbTime += 16;
      }
      if (isGallery) {
        scrollEnergy = Math.min(1, scrollEnergy + 0.015);
      } else if (mobileOrbRamp > 0) {
        scrollEnergy = Math.min(1, scrollEnergy + 0.018);
        mobileOrbRamp = Math.max(0, mobileOrbRamp - 1);
      } else {
        scrollEnergy = Math.max(0, scrollEnergy - 0.008);
      }
      if (!transitionStarted) orbTime = time;

      if (transitionStarted) {
        orbAlpha = Math.max(0, orbAlpha - 0.02);
        // Tier bajo: el orbe post-intro espera a que los orbes del intro terminen
        // de desvanecerse por completo antes de empezar a aparecer (secuencial,
        // no cruzado), para que no se vea un tercer orbe superpuesto de golpe.
        if (!lowTier || orbAlpha <= 0) {
          heroOrbAlpha = Math.min(1, heroOrbAlpha + 0.012);
        }
      }

      frameCount++;
      // Tier bajo: dibujamos a ~30fps en vez de 60fps. El estado (tiempos, alphas)
      // sigue avanzando cada frame para no perder velocidad de la animación.
      if (lowTier && frameCount % 2 === 0) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const minDim = Math.min(width, height);
      const activeOrbs = lowTier ? orbsMinimal : lightweight ? orbsReduced : orbsFull;

      // --- 1. DIBUJAR ORBES (INTRO) ---
      drawGlowLayer((octx, scale) => {
        activeOrbs.forEach((orb) => {
          const x = width / 2 + Math.sin(orbTime * orb.speedX + orb.phaseX) * (width * 0.4) + Math.cos(orbTime * orb.speedX * 0.5) * (width * 0.1);
          const y = height / 2 + Math.cos(orbTime * orb.speedY + orb.phaseY) * (height * 0.4) + Math.sin(orbTime * orb.speedY * 0.5) * (height * 0.1);

          const radius = minDim * orb.size;

          const gradient = octx.createRadialGradient(x * scale, y * scale, 0, x * scale, y * scale, radius * scale);
          gradient.addColorStop(0, orb.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          octx.fillStyle = gradient;
          octx.beginPath();
          octx.arc(x * scale, y * scale, radius * scale, 0, Math.PI * 2);
          octx.fill();
        });
      }, 80, orbAlpha, 'screen');

      // --- 2. LÓGICA DE TIEMPOS (BURST + PAUSA) PARA LUCES ---
      const BURST_DURATION = 5000; 
      const PAUSE_DURATION = 10000; 
      const TOTAL_CYCLE = BURST_DURATION + PAUSE_DURATION; 
      
      const currentCycleTime = globalTimer % TOTAL_CYCLE;

      if (globalTimer > 16 && currentCycleTime < 16) {
        const allLightIndices = [0, 1, 2, 3];
        currentBurstIndices = shuffle(allLightIndices).slice(0, 3);
      }

      // --- 3. DIBUJAR COMETAS / MECHAS (omitido en tier bajo: es el bloque más caro,
      // por el shadowBlur y los ~25 segmentos con curvas de Bézier por frame) ---
      if (!lowTier) comets.forEach((comet, index) => {
        const p0 = { x: comet.p0.x * width, y: comet.p0.y * height };
        const p1 = { x: comet.p1.x * width, y: comet.p1.y * height };
        const p2 = { x: comet.p2.x * width, y: comet.p2.y * height };
        const p3 = { x: comet.p3.x * width, y: comet.p3.y * height };

        if (!comet.isParticles) {
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
          ctx.strokeStyle = 'rgba(255, 107, 0, 0.08)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (!comet.isParticles) {
          if (currentBurstIndices.includes(index)) {
            const burstPos = currentBurstIndices.indexOf(index); 
            const startOffset = burstPos * 1000; 

            if (currentCycleTime >= startOffset && currentCycleTime <= startOffset + comet.duration) {
              const p = (currentCycleTime - startOffset) / comet.duration;
              const lightLength = 0.1;
              const segments = lightweight ? 10 : 25;

              ctx.globalCompositeOperation = 'screen';

              for (let i = 0; i < segments; i++) {
                const tCurrent = p - (i * lightLength / segments);
                const tNext = p - ((i + 1) * lightLength / segments);
                
                if (tCurrent < 0) break;
                const safeTNext = Math.max(0, tNext);

                const pt1 = getBezierPoint(tCurrent, p0, p1, p2, p3);
                const pt2 = getBezierPoint(safeTNext, p0, p1, p2, p3);

                const ratio = 1 - (i / segments); 

                let edgeFade = 1;
                if (p < 0.1) edgeFade = p / 0.1;
                if (p > 0.9) edgeFade = (1 - p) / 0.1;

                const r = 255;
                const g = 180;
                const b = 80;
                
                const localFade = Math.sin(ratio * Math.PI); 
                const alpha = localFade * edgeFade;
                
                if (lightweight) {
                  // Glow alternativo en móviles / tiers no-altos, sin shadowBlur
                  ctx.beginPath();
                  ctx.moveTo(pt1.x, pt1.y);
                  ctx.lineTo(pt2.x, pt2.y);
                  ctx.strokeStyle = `rgba(255, 167, 38, ${alpha * 0.3})`;
                  ctx.lineWidth = 6;
                  ctx.lineCap = 'round';
                  ctx.stroke();

                  ctx.beginPath();
                  ctx.moveTo(pt1.x, pt1.y);
                  ctx.lineTo(pt2.x, pt2.y);
                  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                  ctx.lineWidth = 1.5;
                  ctx.lineCap = 'round';
                  ctx.stroke();
                } else {
                  ctx.beginPath();
                  ctx.moveTo(pt1.x, pt1.y);
                  ctx.lineTo(pt2.x, pt2.y);
                  ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                  ctx.lineWidth = 2; 
                  ctx.lineCap = 'round';
                  
                  ctx.shadowColor = `rgba(255, 167, 38, ${alpha})`;
                  ctx.shadowBlur = 15;

                  ctx.stroke();
                  ctx.shadowBlur = 0; 
                }
              }
              ctx.globalCompositeOperation = 'source-over'; 
            }
          }
        }
      });

      // --- SCROLL ORBS (re-aparecen durante el scroll, omitido en tier bajo) ---
      if (transitionStarted && scrollEnergy > 0.01 && !isGallery && !lowTier) {
        drawGlowLayer((octx, scale) => {
          activeOrbs.forEach((orb) => {
            const x = width / 2 + Math.sin(scrollOrbTime * orb.speedX + orb.phaseX) * (width * 0.4) + Math.cos(scrollOrbTime * orb.speedX * 0.5) * (width * 0.1);
            const y = height / 2 + Math.cos(scrollOrbTime * orb.speedY + orb.phaseY) * (height * 0.4) + Math.sin(scrollOrbTime * orb.speedY * 0.5) * (height * 0.1);
            const radius = minDim * orb.size;
            const gradient = octx.createRadialGradient(x * scale, y * scale, 0, x * scale, y * scale, radius * scale);
            gradient.addColorStop(0, orb.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            octx.fillStyle = gradient;
            octx.beginPath();
            octx.arc(x * scale, y * scale, radius * scale, 0, Math.PI * 2);
            octx.fill();
          });
        }, 80, scrollEnergy * 0.6, 'screen');
      }

      // --- ORBE HERO (POST-INTRO) ---
      // Orbe única centrada en el top que ilumina el centro superior e inferior
      if (heroOrbAlpha > 0 && !isGallery) {
        const scrollMoveX = Math.sin(scrollOrbTime * 0.0007) * (width * 0.18) * scrollEnergy;
        const scrollMoveY = Math.cos(scrollOrbTime * 0.0005) * (height * 0.1) * scrollEnergy;
        const orbX = width / 2 + scrollMoveX;
        const orbY = scrollMoveY;

        // Respiración sutil para que no sea completamente estática
        const breathe = 1 + Math.sin(waveTime * 0.5) * 0.05;
        const heroAlpha = heroOrbAlpha * breathe;

        // Capa 1: glow exterior amplio (ilumina el centro superior e inferior)
        drawGlowLayer((octx, scale) => {
          const outerR = Math.max(width * 0.78, height * 1.05);
          const outerGrad = octx.createRadialGradient(orbX * scale, orbY * scale, 0, orbX * scale, orbY * scale, outerR * scale);
          outerGrad.addColorStop(0,    'rgba(200, 70, 0, 0.70)');
          outerGrad.addColorStop(0.30, 'rgba(130, 42, 0, 0.38)');
          outerGrad.addColorStop(0.60, 'rgba(60, 15, 0, 0.14)');
          outerGrad.addColorStop(1,    'rgba(0, 0, 0, 0)');
          octx.fillStyle = outerGrad;
          octx.beginPath();
          octx.arc(orbX * scale, orbY * scale, outerR * scale, 0, Math.PI * 2);
          octx.fill();
        }, 90, heroAlpha, 'screen');

        // Capa 2: núcleo brillante concentrado en el top-center
        drawGlowLayer((octx, scale) => {
          const innerR = Math.min(width, height) * 0.58;
          const innerGrad = octx.createRadialGradient(orbX * scale, orbY * scale, 0, orbX * scale, orbY * scale, innerR * scale);
          innerGrad.addColorStop(0,    'rgba(255, 130, 0, 0.95)');
          innerGrad.addColorStop(0.20, 'rgba(230, 88, 0, 0.58)');
          innerGrad.addColorStop(0.50, 'rgba(150, 48, 0, 0.24)');
          innerGrad.addColorStop(1,    'rgba(0, 0, 0, 0)');
          octx.fillStyle = innerGrad;
          octx.beginPath();
          octx.arc(orbX * scale, orbY * scale, innerR * scale, 0, Math.PI * 2);
          octx.fill();
        }, 55, heroAlpha, 'screen');
      }

      ctx.globalAlpha = 1; // Restaurar alpha
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('hero-move-up', handleTransition);
      window.removeEventListener('scroll', handleScroll, true);
      if (scrollTimeoutId) window.clearTimeout(scrollTimeoutId);
      titleObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isGallery, active]);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
