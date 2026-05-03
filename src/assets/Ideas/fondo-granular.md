# Fondo Granular Retro Futurista 80s

Este fondo utiliza dos filtros SVG (inyectados mediante Data URIs) combinados con CSS `background-blend-mode` para generar un efecto granulado, caótico y orgánico, donde aparecen manchas de colores violetas y marrones intensos que se asemejan a interferencia o estática de los años 80.

## Características

- **Sin Cuadrantes ni Patrones:** Las manchas se expanden y cubren toda la pantalla.
- **Grano Fino:** Un ruido de alta densidad que se repite de manera continua y sin bordes divisorios.
- **Tonos Limitados:** Todo el ruido se mapea matemáticamente a tonos de violeta y marrón oscuro.

## Código de Implementación

Para implementarlo, sustituye o actualiza las propiedades del `body` en tu archivo de estilos principal (por ejemplo, `index.css`):

```css
body {
  /* Fondo retro futurista 80s: Manchas aleatorias en un solo bloque y granos de colores */
  background-image: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='clouds'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015625' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2.5' intercept='-0.75'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix type='matrix' values='0.372 0 0 0 0.243 0.184 0 0 0 0.121 0.812 0 0 0 0.054 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23clouds)'/%3E%3C/svg%3E");
  background-blend-mode: hard-light, normal;
  background-size: 256px 256px, cover;
  background-repeat: repeat, no-repeat;
  background-color: #3e1f0e;
  background-attachment: fixed;
  color: var(--color-on-background);
  font-family: "Inter", sans-serif;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
  overflow-x: hidden; /* evita scroll horizontal por animaciones que salen del viewport */
}
```
