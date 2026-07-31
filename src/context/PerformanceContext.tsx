import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getDeviceHints,
  estimateInitialTier,
  measureRuntimeTier,
  logPerformanceReport,
  type PerformanceTier,
} from '../lib/performanceTier';

interface PerformanceContextValue {
  tier: PerformanceTier;
  measured: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue>({ tier: 'high', measured: false });

export function PerformanceProvider({ children }: { children: ReactNode }) {
  // Fase 1 (inmediata): heurística estática, disponible desde el primer render
  // para que el intro no arranque "pesado" y tenga que corregirse a mitad de camino.
  const [tier, setTier] = useState<PerformanceTier>(() => estimateInitialTier(getDeviceHints()));
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    // Fase 2 (después de ~1.2s): tier ajustado con el frame time real del navegador.
    const cancel = measureRuntimeTier((metrics, measuredTier, hints) => {
      logPerformanceReport(hints, metrics, measuredTier);
      setTier(measuredTier);
      setMeasured(true);
    });
    return cancel;
  }, []);

  return <PerformanceContext.Provider value={{ tier, measured }}>{children}</PerformanceContext.Provider>;
}

export function usePerformanceTier(): PerformanceContextValue {
  return useContext(PerformanceContext);
}
