import { useRef, useEffect } from 'react';
import styles from './GlowBackground.module.css';

export function GlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
    let waveTime = 0;
    let rafId: number;

    let waveAlpha = 0;
    let orbAlpha = 1;
    let transitionStarted = false;

    const handleTransition = () => {
      transitionStarted = true;
    };

    window.addEventListener('hero-move-up', handleTransition);

    // Orbs in varying shades of orange
    const orbs = [
      { color: 'rgba(255, 107, 0, 0.8)', size: 0.8, speedX: 0.0006, speedY: 0.0005, phaseX: 0, phaseY: 1 },
      { color: 'rgba(255, 167, 38, 0.6)', size: 0.9, speedX: 0.0004, speedY: 0.0003, phaseX: 2, phaseY: 3 },
      { color: 'rgba(204, 68, 0, 0.9)', size: 0.7, speedX: 0.0005, speedY: 0.0006, phaseX: 4, phaseY: 5 },
      { color: 'rgba(255, 80, 0, 0.6)', size: 1.0, speedX: 0.0003, speedY: 0.0004, phaseX: 1, phaseY: 4 },
      { color: 'rgba(255, 140, 0, 0.5)', size: 0.6, speedX: 0.0007, speedY: 0.0005, phaseX: 3, phaseY: 2 }
    ];

    const getGlowHeight = (x: number, t: number) => {
      let h = 127;
      h += Math.sin(x * 0.01 + t) * 28;
      h += Math.cos(x * 0.02 - t * 0.7) * 18;
      h += Math.sin(x * 0.005 + t * 0.5) * 36;
      return Math.min(182, Math.max(127, h));
    };

    const animate = () => {
      time += 16;
      waveTime += 0.007;

      if (transitionStarted) {
        waveAlpha = Math.min(1, waveAlpha + 0.015);
        orbAlpha = Math.max(0, orbAlpha - 0.02);
        if (overlayRef.current) {
          overlayRef.current.style.opacity = orbAlpha.toString();
        }
      }
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const minDim = Math.min(width, height);

      // --- DIBUJAR ORBES (INTRO) ---
      if (orbAlpha > 0) {
        ctx.globalAlpha = orbAlpha;
        ctx.globalCompositeOperation = 'screen';

        orbs.forEach((orb) => {
          // Fluid motion using Lissajous curves + sine waves
          const x = width / 2 + Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.4) + Math.cos(time * orb.speedX * 0.5) * (width * 0.1);
          const y = height / 2 + Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.4) + Math.sin(time * orb.speedY * 0.5) * (height * 0.1);
          
          const radius = minDim * orb.size;

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, orb.color);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.globalCompositeOperation = 'source-over';
      }

      // --- DIBUJAR WAVE INFERIOR (POST-INTRO) ---
      if (waveAlpha > 0) {
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

      ctx.globalAlpha = 1; // Restaurar alpha para el siguiente frame
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('hero-move-up', handleTransition);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={overlayRef} className={styles.overlay}></div>
    </div>
  );
}
