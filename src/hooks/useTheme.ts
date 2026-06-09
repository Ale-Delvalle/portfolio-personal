import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Siempre forzamos a dark mode, pero dejamos comentada la lógica original de claro/oscuro para futura re-implementación.
  const [theme] = useState<Theme>('dark');

  /*
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  */

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  /*
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);
  */

  const toggleTheme = () => {
    // Funcionalidad comentada para futura re-implementación
    // setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
