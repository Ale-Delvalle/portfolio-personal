import { useRef, useEffect } from 'react';
import styles from './GlowBackground.module.css';

export function GlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let time = 0;
    let rafId: number;

    const getGlowHeight = (x: number, t: number) => {
      let h = 127;
      h += Math.sin(x * 0.01 + t) * 28;
      h += Math.cos(x * 0.02 - t * 0.7) * 18;
      h += Math.sin(x * 0.005 + t * 0.5) * 36;
      return Math.min(182, Math.max(127, h));
    };

    const drawGlow = () => {
      time += 0.007;
      ctx.filter = 'blur(20px)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        const h = getGlowHeight(x, time);
        ctx.lineTo(x, canvas.height - h);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - 182);
      gradient.addColorStop(0, '#1a0a03');
      gradient.addColorStop(0.3, '#E65100');
      gradient.addColorStop(0.6, '#FFA726');
      gradient.addColorStop(0.85, '#FFF59D');
      gradient.addColorStop(1, 'rgba(255, 245, 157, 0)');

      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.filter = 'none';
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGlow();
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
