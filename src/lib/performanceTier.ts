export type PerformanceTier = 'low' | 'medium' | 'high';

export interface DeviceHints {
  cores: number | null;
  memoryGB: number | null;
  isMobile: boolean;
  reducedMotion: boolean;
  saveData: boolean;
}

export interface RuntimeMetrics {
  avgFps: number;
  avgFrameMs: number;
  maxFrameMs: number;
  jankRatio: number;
  sampleCount: number;
}

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export function getDeviceHints(): DeviceHints {
  const nav = navigator as NavigatorWithHints;
  return {
    cores: nav.hardwareConcurrency ?? null,
    memoryGB: nav.deviceMemory ?? null,
    isMobile: window.innerWidth < 1024 || /Android|iPhone|iPad|iPod/i.test(nav.userAgent),
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    saveData: nav.connection?.saveData ?? false,
  };
}

// Estimación inmediata (sin esperar mediciones) para decidir la calidad del
// primer frame, antes de tener datos reales de FPS.
export function estimateInitialTier(hints: DeviceHints): PerformanceTier {
  if (hints.reducedMotion || hints.saveData) return 'low';

  // Safari no expone deviceMemory y muchos navegadores no exponen hardwareConcurrency
  // con precisión: sin esos datos, asumimos gama media/alta en vez de castigar a ciegas.
  if (hints.cores === null && hints.memoryGB === null) {
    return hints.isMobile ? 'medium' : 'high';
  }

  let score = 0;
  if (hints.cores !== null) score += hints.cores >= 8 ? 2 : hints.cores >= 4 ? 1 : 0;
  if (hints.memoryGB !== null) score += hints.memoryGB >= 8 ? 2 : hints.memoryGB >= 4 ? 1 : 0;
  if (hints.isMobile) score -= 1;

  if (score >= 3) return 'high';
  if (score >= 1) return 'medium';
  return 'low';
}

const SAMPLE_WINDOW_MS = 1200;

// Mide el frame time real del navegador durante una ventana corta y devuelve
// un tier ajustado. Es la señal más confiable: un hardwareConcurrency alto no
// garantiza que el hilo principal esté libre (throttling, otras pestañas, etc.).
export function measureRuntimeTier(
  onDone: (metrics: RuntimeMetrics, tier: PerformanceTier, hints: DeviceHints) => void
): () => void {
  const hints = getDeviceHints();

  if (hints.reducedMotion) {
    onDone({ avgFps: 0, avgFrameMs: 0, maxFrameMs: 0, jankRatio: 0, sampleCount: 0 }, 'low', hints);
    return () => {};
  }

  const frameTimes: number[] = [];
  let last = performance.now();
  const start = last;
  let rafId = 0;
  let cancelled = false;

  const finish = () => {
    // Se descarta el primer frame: siempre incluye el costo de arranque (parseo, hydration).
    const samples = frameTimes.slice(1);
    if (samples.length === 0) {
      onDone({ avgFps: 60, avgFrameMs: 16.6, maxFrameMs: 16.6, jankRatio: 0, sampleCount: 0 }, 'high', hints);
      return;
    }

    const avgFrameMs = samples.reduce((a, b) => a + b, 0) / samples.length;
    const maxFrameMs = Math.max(...samples);
    const jankFrames = samples.filter((ms) => ms > 33.34).length;
    const jankRatio = jankFrames / samples.length;
    const avgFps = 1000 / avgFrameMs;

    const metrics: RuntimeMetrics = { avgFps, avgFrameMs, maxFrameMs, jankRatio, sampleCount: samples.length };

    let tier: PerformanceTier;
    if (avgFps >= 55 && jankRatio < 0.05) tier = 'high';
    else if (avgFps >= 35 && jankRatio < 0.25) tier = 'medium';
    else tier = 'low';

    // Un celular puede medir buen FPS en reposo (nada se está animando todavía)
    // y aun así sufrir con las animaciones reales: nunca lo dejamos en 'high'.
    if (hints.isMobile && tier === 'high') tier = 'medium';

    onDone(metrics, tier, hints);
  };

  const tick = (now: number) => {
    if (cancelled) return;
    frameTimes.push(now - last);
    last = now;
    if (now - start < SAMPLE_WINDOW_MS) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    finish();
  };

  rafId = requestAnimationFrame(tick);
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

export function logPerformanceReport(hints: DeviceHints, metrics: RuntimeMetrics, tier: PerformanceTier): void {
  const style =
    tier === 'high'
      ? 'color: #4ade80; font-weight: bold'
      : tier === 'medium'
      ? 'color: #facc15; font-weight: bold'
      : 'color: #f87171; font-weight: bold';

  console.groupCollapsed(`%c[Performance] Tier detectado: ${tier.toUpperCase()}`, style);
  console.log('CPU cores:', hints.cores ?? 'no disponible');
  console.log('RAM aprox (GB):', hints.memoryGB ?? 'no disponible');
  console.log('Mobile / pantalla chica:', hints.isMobile);
  console.log('prefers-reduced-motion:', hints.reducedMotion);
  console.log('Data Saver activado:', hints.saveData);
  if (metrics.sampleCount > 0) {
    console.log(
      `FPS medido: ${metrics.avgFps.toFixed(1)} (frame promedio ${metrics.avgFrameMs.toFixed(2)}ms, peor frame ${metrics.maxFrameMs.toFixed(2)}ms)`
    );
    console.log(`Frames con jank (>33ms): ${(metrics.jankRatio * 100).toFixed(1)}%`);
  } else {
    console.log('Medición de FPS omitida (prefers-reduced-motion activo)');
  }
  console.groupEnd();
}
