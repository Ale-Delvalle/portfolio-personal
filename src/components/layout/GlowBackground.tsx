import { useRef, useEffect } from 'react';
import styles from './GlowBackground.module.css';

export function GlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let orbTime = 0;
    let waveTime = 0;
    let rafId: number;

    let waveAlpha = 0;
    let orbAlpha = 1;
    let transitionStarted = false;
    let introDoneSet = false;

    const getIsDark = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr) return attr === 'dark';
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const handleTransition = () => {
      transitionStarted = true;
    };

    window.addEventListener('hero-move-up', handleTransition);

    const orbs = [
      { color: 'rgba(255, 107, 0, 0.8)', size: 0.8, speedX: 0.0006, speedY: 0.0005, phaseX: 0, phaseY: 1 },
      { color: 'rgba(255, 167, 38, 0.6)', size: 0.9, speedX: 0.0004, speedY: 0.0003, phaseX: 2, phaseY: 3 },
      { color: 'rgba(204, 68, 0, 0.9)', size: 0.7, speedX: 0.0005, speedY: 0.0006, phaseX: 4, phaseY: 5 },
      { color: 'rgba(255, 80, 0, 0.6)', size: 1.0, speedX: 0.0003, speedY: 0.0004, phaseX: 1, phaseY: 4 },
      { color: 'rgba(255, 140, 0, 0.5)', size: 0.6, speedX: 0.0007, speedY: 0.0005, phaseX: 3, phaseY: 2 }
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

    const getGlowHeight = (x: number, t: number) => {
      let h = 127;
      h += Math.sin(x * 0.01 + t) * 28;
      h += Math.cos(x * 0.02 - t * 0.7) * 18;
      h += Math.sin(x * 0.005 + t * 0.5) * 36;
      return Math.min(182, Math.max(127, h));
    };

    const particles: Array<{x: number, y: number, vx: number, vy: number, life: number, size: number}> = [];
    
    // Variables para el control de "Bursts" (Ráfagas) y Pausas de 10s
    let globalTimer = 0;
    let currentBurstIndices = [0, 1, 2];

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
      const isDarkTheme = getIsDark();
      const isDesktopLight = !isDarkTheme && width >= 1024;

      // Sincronizar data-intro-done con el estado real del tema
      if (isDarkTheme && introDoneSet) {
        document.documentElement.removeAttribute('data-intro-done');
        introDoneSet = false;
      }

      time += 16;
      globalTimer += 16;
      waveTime += 0.007;
      if (!transitionStarted) orbTime = time;

      if (transitionStarted) {
        waveAlpha = Math.min(1, waveAlpha + 0.015);
        orbAlpha = Math.max(0, orbAlpha - 0.02);
      }

      // Desktop light: fondo transiciona de negro a crema a medida que los orbes se desvanecen
      if (isDesktopLight && transitionStarted) {
        const t = 1 - orbAlpha;
        const r = Math.round(248 * t);
        const g = Math.round(246 * t);
        const b = Math.round(242 * t);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(0, 0, width, height);

      const minDim = Math.min(width, height);

      // --- 1. DIBUJAR ORBES (INTRO) ---
      if (orbAlpha > 0) {
        ctx.globalAlpha = orbAlpha;
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(80px)'; 

        orbs.forEach((orb) => {
          const x = width / 2 + Math.sin(orbTime * orb.speedX + orb.phaseX) * (width * 0.4) + Math.cos(orbTime * orb.speedX * 0.5) * (width * 0.1);
          const y = height / 2 + Math.cos(orbTime * orb.speedY + orb.phaseY) * (height * 0.4) + Math.sin(orbTime * orb.speedY * 0.5) * (height * 0.1);
          
          const radius = minDim * orb.size;

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, orb.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.filter = 'none';
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }

      // --- 2. LÓGICA DE TIEMPOS (BURST + PAUSA) PARA LUCES ---
      const BURST_DURATION = 5000; 
      const PAUSE_DURATION = 10000; 
      const TOTAL_CYCLE = BURST_DURATION + PAUSE_DURATION; 
      
      const currentCycleTime = globalTimer % TOTAL_CYCLE;

      if (globalTimer > 16 && currentCycleTime < 16) {
        const allLightIndices = [0, 1, 2, 3];
        currentBurstIndices = shuffle(allLightIndices).slice(0, 3);
      }

      // --- 3. DIBUJAR COMETAS / MECHAS ---
      // Desktop light post-intro: fondo crema con glow cálido sutil en la base
      if (isDesktopLight && orbAlpha === 0) {
        if (!introDoneSet) {
          document.documentElement.setAttribute('data-intro-done', 'true');
          introDoneSet = true;
        }
        if (waveAlpha > 0) {
          ctx.globalAlpha = waveAlpha * 0.1;
          ctx.filter = 'blur(50px)';
          ctx.beginPath();
          ctx.moveTo(0, height);
          for (let x = 0; x <= width; x += 10) {
            const h = getGlowHeight(x, waveTime);
            ctx.lineTo(x, height - h * 0.4);
          }
          ctx.lineTo(width, height);
          ctx.closePath();
          const lightGrad = ctx.createLinearGradient(0, height, 0, height - 80);
          lightGrad.addColorStop(0, 'rgba(140, 67, 29, 0.7)');
          lightGrad.addColorStop(0.6, 'rgba(140, 67, 29, 0.2)');
          lightGrad.addColorStop(1, 'rgba(140, 67, 29, 0)');
          ctx.fillStyle = lightGrad;
          ctx.fill();
          ctx.filter = 'none';
          ctx.globalAlpha = 1;
        }
        rafId = requestAnimationFrame(animate);
        return;
      }

      comets.forEach((comet, index) => {
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

        if (comet.isParticles) {
          if (!transitionStarted) return; // Solo empieza cuando termina la intro
          const p = ((time + 2000) % 22000) / comet.duration;

          if (p >= 0 && p <= 1) {
            let emissionRate = 3; 
            if (p < 0.1 || p > 0.9) emissionRate = 0.5;

            if (Math.random() < emissionRate) {
              const head = getBezierPoint(p, p0, p1, p2, p3);
              const count = Math.floor(Math.random() * 3) + 1;
              for(let i=0; i<count; i++) {
                particles.push({
                  x: head.x + (Math.random() - 0.5) * 15,
                  y: head.y + (Math.random() - 0.5) * 15,
                  vx: (Math.random() - 0.5) * 0.8,
                  vy: (Math.random() * -1) - 0.2,
                  life: 1.0 + Math.random() * 0.5,
                  size: Math.random() * 2.5 + 0.5
                });
              }
            }
          }
        } else {
          if (currentBurstIndices.includes(index)) {
            const burstPos = currentBurstIndices.indexOf(index); 
            const startOffset = burstPos * 1000; 

            if (currentCycleTime >= startOffset && currentCycleTime <= startOffset + comet.duration) {
              const p = (currentCycleTime - startOffset) / comet.duration;
              const lightLength = 0.1; 
              const segments = 25; 

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

                ctx.beginPath();
                ctx.moveTo(pt1.x, pt1.y);
                ctx.lineTo(pt2.x, pt2.y);

                const r = 255;
                const g = 180;
                const b = 80;
                
                const localFade = Math.sin(ratio * Math.PI); 
                const alpha = localFade * edgeFade;
                
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.lineWidth = 2; 
                ctx.lineCap = 'round';
                
                ctx.shadowColor = `rgba(255, 167, 38, ${alpha})`;
                ctx.shadowBlur = 15;

                ctx.stroke();
                ctx.shadowBlur = 0; 
              }
              ctx.globalCompositeOperation = 'source-over'; 
            }
          }
        }
      });

      // --- 4. ACTUALIZAR Y DIBUJAR PARTÍCULAS ---
      ctx.globalCompositeOperation = 'screen';
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008; 
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.size > 2) {
          ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 107, 0, ${alpha})`;
        }
        ctx.fill();
        
        if (p.life > 0.5 && p.size > 1.5) {
          ctx.shadowColor = `rgba(255, 167, 38, ${alpha})`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalCompositeOperation = 'source-over';



      // --- DIBUJAR WAVE INFERIOR (POST-INTRO, solo dark mode) ---
      if (waveAlpha > 0 && !isDesktopLight) {
        ctx.globalAlpha = waveAlpha;
        ctx.filter = 'blur(20px)';
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 10) {
          const h = getGlowHeight(x, waveTime);
          ctx.lineTo(x, height - h);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, height, 0, height - 182);
        gradient.addColorStop(0, '#1a0a03');
        gradient.addColorStop(0.3, '#E65100');
        gradient.addColorStop(0.6, '#FFA726');
        gradient.addColorStop(0.85, '#FFF59D');
        gradient.addColorStop(1, 'rgba(255, 245, 157, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.filter = 'none';
      }

      ctx.globalAlpha = 1; // Restaurar alpha
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('hero-move-up', handleTransition);
      cancelAnimationFrame(rafId);
      document.documentElement.removeAttribute('data-intro-done');
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
