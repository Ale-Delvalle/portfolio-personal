// Detección de celulares de gama baja, exclusiva para decidir si conviene
// omitir la intro animada de Hero en mobile. Es un mecanismo independiente
// del sistema de tiers de lib/performanceTier.ts (que sigue intacto y es el
// único usado por tablet/PC): ese sistema pondera cantidad de cores y mide
// FPS con la página prácticamente inactiva, dos señales que no reflejan bien
// a chips de gama de entrada con muchos núcleos débiles (p. ej. octa-core
// Cortex-A53 de gama baja, que puede reportar 8 cores y aun así trabarse).
//
// Acá en cambio se mide el costo real de un trabajo de dibujo representativo
// (círculos con shadowBlur en canvas, el mismo tipo de operación que usan las
// chispas de la intro) para clasificar el equipo por lo que de verdad puede
// sostener en pantalla, en vez de por specs declaradas.

const PHONE_MAX_WIDTH = 768;

export function isPhoneViewport(): boolean {
  return window.innerWidth < PHONE_MAX_WIDTH;
}

// Umbral de referencia (ms) para considerar el equipo "gama baja". Es un
// punto de partida conservador: si en la práctica un dispositivo real queda
// mal clasificado, ajustar este valor con la medición que se ve en consola
// (ver logMobileIntroDecision) antes que tocar el resto del algoritmo.
const LOW_END_THRESHOLD_MS = 40;
const BENCH_CIRCLES = 1500;

function runCanvasBenchmark(): number {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (!ctx) return 0;

  const start = performance.now();
  for (let i = 0; i < BENCH_CIRCLES; i++) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      Math.random() * 2.5 + 0.5,
      0,
      Math.PI * 2
    );
    ctx.shadowColor = 'rgba(255, 167, 38, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = 'rgba(255, 107, 0, 0.8)';
    ctx.fill();
  }
  return performance.now() - start;
}

export interface MobileIntroDecision {
  skipIntro: boolean;
  benchMs: number;
  reason: 'reduced-motion' | 'low-memory' | 'benchmark' | 'capable';
}

export function detectLowEndPhone(): MobileIntroDecision {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  if (reducedMotion) {
    return { skipIntro: true, benchMs: 0, reason: 'reduced-motion' };
  }

  // Señal barata: con muy poca RAM ya alcanza para descartar sin correr el benchmark.
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) {
    return { skipIntro: true, benchMs: 0, reason: 'low-memory' };
  }

  const benchMs = runCanvasBenchmark();
  return {
    skipIntro: benchMs > LOW_END_THRESHOLD_MS,
    benchMs,
    reason: benchMs > LOW_END_THRESHOLD_MS ? 'benchmark' : 'capable',
  };
}

export function logMobileIntroDecision(decision: MobileIntroDecision): void {
  const style = decision.skipIntro
    ? 'color: #f87171; font-weight: bold'
    : 'color: #4ade80; font-weight: bold';

  console.log(
    `%c[Mobile Intro] ${decision.skipIntro ? 'OMITIDA (gama baja)' : 'reproducida'} — benchmark canvas: ${decision.benchMs.toFixed(1)}ms (umbral: ${LOW_END_THRESHOLD_MS}ms, motivo: ${decision.reason})`,
    style
  );
}
