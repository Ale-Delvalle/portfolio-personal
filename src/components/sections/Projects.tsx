import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './Projects.module.css';
import { ProjectDetail } from './ProjectDetail';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ec1 from '../../assets/projects/screenshots/E-commerce/1.png';
import ec2 from '../../assets/projects/screenshots/E-commerce/2.png';
import ec3 from '../../assets/projects/screenshots/E-commerce/3.png';
import ec4 from '../../assets/projects/screenshots/E-commerce/4.png';
import ec5 from '../../assets/projects/screenshots/E-commerce/5.png';
import ec6 from '../../assets/projects/screenshots/E-commerce/6.png';
import ec7 from '../../assets/projects/screenshots/E-commerce/7.png';
import ec8 from '../../assets/projects/screenshots/E-commerce/8.png';

import hnp1 from '../../assets/projects/screenshots/H-n-P/1.png';
import hnp2 from '../../assets/projects/screenshots/H-n-P/2.png';
import hnp3 from '../../assets/projects/screenshots/H-n-P/3.png';
import hnp4 from '../../assets/projects/screenshots/H-n-P/4.png';
import hnp5 from '../../assets/projects/screenshots/H-n-P/5.png';
import hnp6 from '../../assets/projects/screenshots/H-n-P/6.png';
import hnp7 from '../../assets/projects/screenshots/H-n-P/7.png';
import hnp8 from '../../assets/projects/screenshots/H-n-P/8.png';
import hnp9 from '../../assets/projects/screenshots/H-n-P/9.png';
import hnp10 from '../../assets/projects/screenshots/H-n-P/10.png';
import hnp11 from '../../assets/projects/screenshots/H-n-P/11.png';
import hnp12 from '../../assets/projects/screenshots/H-n-P/12.png';
import hnp13 from '../../assets/projects/screenshots/H-n-P/13.png';


import pb1 from '../../assets/projects/screenshots/Portfolio-basico/1.jpg';
import pb2 from '../../assets/projects/screenshots/Portfolio-basico/2.jpg';

import st1 from '../../assets/projects/screenshots/Sistema-de-turnos/1.png';
import st2 from '../../assets/projects/screenshots/Sistema-de-turnos/2.png';
import st3 from '../../assets/projects/screenshots/Sistema-de-turnos/3.png';
import st4 from '../../assets/projects/screenshots/Sistema-de-turnos/4.png';

import wp1 from '../../assets/projects/screenshots/Web-de-peliculas/1.png';
import wp2 from '../../assets/projects/screenshots/Web-de-peliculas/2.png';
import wp3 from '../../assets/projects/screenshots/Web-de-peliculas/3.png';
import wp4 from '../../assets/projects/screenshots/Web-de-peliculas/4.png';
import wp5 from '../../assets/projects/screenshots/Web-de-peliculas/5.png';

gsap.registerPlugin(ScrollTrigger);

export type Project = {
  id: number;
  title: string;
  listTitle?: string;
  description: string;
  year?: string;
  tags: string[];
  features?: string[];
  image: string;
  screenshots: string[];
  repoUrl?: string;
  repoFrontUrl?: string;
  repoBackUrl?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: 'Astro Tech — E-Commerce',
    listTitle: 'Astro Tech',
    description: 'Plataforma de e-commerce full stack con carrito de compras, panel de administración y autenticación JWT.',
    tags: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'JWT', 'Next.js', 'Zustand', 'React Query', 'Zod', 'Docker', 'Swagger'],
    features: [
      'API REST con NestJS y TypeScript, arquitectura modular por dominio',
      'Autenticación JWT con control de acceso basado en roles (RBAC)',
      'Base de datos relacional con PostgreSQL y TypeORM',
      'Integración con Cloudinary para almacenamiento de imágenes en la nube',
      'Documentación de API con Swagger/OpenAPI',
      'Frontend en Next.js con App Router, estado global con Zustand y data fetching con React Query',
      'Validación de schemas con Zod integrado con react-hook-form',
      'Containerización con Docker Compose'
    ],
    image: ec1,
    screenshots: [ec1, ec2, ec3, ec4, ec5, ec6, ec7, ec8],
    repoFrontUrl: 'https://github.com/Ale-Delvalle/pi4-e-commerce-front',
    repoBackUrl: 'https://github.com/Ale-Delvalle/pi4-e-commerce',
  },
  {
    id: 2,
    title: 'Hearts & Paws',
    listTitle: 'Hearts & Paws',
    description: 'Proyecto grupal · Educativo \nPlataforma para ONGs de rescate animal que conecta organizaciones protectoras con adoptantes. Gestiona adopciones, donaciones con pasarela de pago y mensajería en tiempo real. Trabajé en un grupo conformado por 6 personas, en donde participé del equipo de backend.',
    tags: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma', 'JWT', 'Stripe', 'Socket.io', 'Cloudinary', 'Google Cloud Vision', 'Nodemailer', 'Jest'],
    features: [
      'API REST modular con NestJS y TypeScript, arquitectura por dominio de negocio',
      'Base de datos relacional con PostgreSQL y Prisma ORM, incluyendo migraciones y esquema tipado',
      'Autenticación híbrida: JWT local con cookies HttpOnly y soporte para tokens de Supabase Auth',
      'Control de acceso por roles (RBAC) con guards y decoradores personalizados',
      'Integración con Stripe para procesamiento de donaciones, con webhook seguro y control de duplicidad',
      'Moderación automática de imágenes con Sightengine y Google Cloud Vision — imágenes sensibles se almacenan pixeladas en Cloudinary',
      'Mensajería en tiempo real con WebSockets (Socket.io) con salas por conversación y persistencia en base de datos',
      'Notificaciones por email concurrentes con Nodemailer y Resend usando Promise.all',
      'Sanitización XSS y validación global de DTOs con whitelist estricta',
      'Tests unitarios y de integración con Jest y Supertest'
    ],
    image: hnp1,
    screenshots: [hnp1, hnp2, hnp3, hnp4, hnp5, hnp6, hnp7, hnp8, hnp9, hnp10, hnp11, hnp12, hnp13],
    repoUrl: 'https://github.com/Ale-Delvalle/backend-hearts-and-paws',
  },
  {
    id: 3,
    title: 'Punto de partida',
    description: 'Primer proyecto personal desarrollado con tecnologías web fundamentales, sin frameworks ni librerías externas.',
    tags: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Jasmine'],
    features: [
      'Página web estática con perfil personal y gestor de actividades favoritas',
      'Frontend puro con HTML5, CSS3 y JavaScript ES6+ vanilla — sin bundler ni framework',
      'Patrón Repository para gestión de datos en memoria',
      'Grid responsivo con CSS Grid sin media queries',
      'Tests unitarios con Jasmine'
    ],
    image: pb1,
    screenshots: [pb1, pb2],
  },
  {
    id: 4,
    title: 'Clínica San Sebastián',
    description: 'Sistema de gestión de turnos médicos con autenticación, validaciones de negocio y panel de usuario.',
    tags: ['TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'TypeORM', 'React', 'Vite', 'Formik'],
    features: [
      'API REST con Express y TypeScript, arquitectura de 4 capas: router → controller → service → repository',
      'Base de datos relacional con PostgreSQL y TypeORM',
      'Autenticación con usuario y contraseña, sesión persistida con React Context API',
      'Validaciones de negocio: turnos con mínimo 48h de anticipación, solo días hábiles y horario laboral',
      'Frontend en React con Vite, React Router y Formik para gestión de formularios',
      'Rutas protegidas con redirección automática si no hay sesión activa'
    ],
    image: st1,
    screenshots: [st1, st2, st3, st4],
    repoUrl: 'https://github.com/Ale-Delvalle/pi3-turnos',
  },
  {
    id: 5,
    title: 'Pelisplay',
    description: 'Aplicación full stack de gestión de películas con carrusel 3D inmersivo, construida con Node.js y MongoDB.',
    tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JavaScript', 'GSAP', 'Webpack', 'Jest'],
    features: [
      'API REST con Node.js y Express, arquitectura de 3 capas: controller → service → model',
      'Base de datos NoSQL con MongoDB y Mongoose',
      'Catálogo con vista en carrusel 3D animado con GSAP y vista en grilla',
      'CRUD completo: agregar y eliminar películas con confirmación modal',
      'Frontend empaquetado con Webpack, peticiones HTTP con Axios',
      'Tests unitarios con Jest'
    ],
    image: wp1,
    screenshots: [wp1, wp2, wp3, wp4, wp5],
    repoUrl: 'https://github.com/Ale-Delvalle/pi2-movie-club',
  },
];

export function Projects() {
  const sectionRef    = useRef<HTMLElement>(null);
  const mainRef       = useRef<HTMLDivElement>(null);
  const detailRef     = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const heroRef         = useRef<HTMLDivElement>(null);
  const heroImgRef      = useRef<HTMLImageElement>(null);
  const firstScreenRef  = useRef<HTMLDivElement>(null);
  const detailHeaderRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef     = useRef<(HTMLDivElement | null)[]>([]);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef      = useRef<HTMLSpanElement>(null);
  const scrollTlRef        = useRef<gsap.core.Timeline | null>(null);

  const [activeId,  setActiveId]  = useState(1);
  const [selected,  setSelected]  = useState<Project | null>(null);
  // keeps content in DOM during close animation
  const lastRef          = useRef<Project | null>(null);
  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const isNavigatingRef  = useRef(false);

  // ── Auto-advance carousel every 10s ────────────────────
  const startCarousel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveId(prev => prev === projects.length ? 1 : prev + 1);
    }, 10000);
  }, []);

  useEffect(() => {
    if (!selected) {
      startCarousel();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [selected, startCarousel]);

  // ── Intercept navbar navigation while detail is open ───
  useEffect(() => {
    if (!selected) return;

    const handleNavigate = (e: Event) => {
      // Let the re-dispatch pass through to App.tsx
      if (isNavigatingRef.current) return;

      e.stopImmediatePropagation();
      const targetId = (e as CustomEvent<{ id: string }>).detail.id;
      isNavigatingRef.current = true;

      gsap.killTweensOf([detailRef.current, mainRef.current]);

      gsap.to(detailRef.current, {
        autoAlpha: 0,
        duration: 0.32,
        ease: 'power3.in',
        onComplete: () => {
          setSelected(null);
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
          // We're closing via in-app navigation, not the Back button: defuse
          // the synthetic history entry instead of leaving it dangling.
          if ((window.history.state as { projectGallery?: boolean } | null)?.projectGallery) {
            window.history.replaceState(null, '');
          }
          // Restore main view silently so Projects looks correct on return
          gsap.set(mainRef.current, { x: '0%', autoAlpha: 1 });
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: { id: targetId } }));
            isNavigatingRef.current = false;
          }, 40);
        },
      });
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, [selected]);

  const startScrollBounce = useCallback(() => {
    if (scrollTlRef.current) scrollTlRef.current.kill();
    gsap.set(scrollTextRef.current, { y: 0 });
    scrollTlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 2, repeatRefresh: true });
    scrollTlRef.current
      .to(scrollTextRef.current, { y: -12, duration: 0.3,  yoyo: true, repeat: 9, ease: 'power2.out' })
      .to(scrollTextRef.current, { y: -6,  duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })
      .to(scrollTextRef.current, { y: -2,  duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  }, []);

  // ── Scroll indicator via section-entered event ──────────
  useEffect(() => {
    const delayedCallRef = { current: null as gsap.core.Tween | null };

    const handler = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id === 'proyectos') {
        delayedCallRef.current = gsap.delayedCall(1.8, () => {
          gsap.to(scrollIndicatorRef.current, {
            autoAlpha: 1, duration: 0.8, ease: 'power2.out',
            onComplete: startScrollBounce,
          });
        });
      } else {
        if (delayedCallRef.current) { delayedCallRef.current.kill(); delayedCallRef.current = null; }
        if (scrollTlRef.current) { scrollTlRef.current.kill(); scrollTlRef.current = null; }
        gsap.killTweensOf(scrollIndicatorRef.current);
        gsap.to(scrollIndicatorRef.current, { autoAlpha: 0, duration: 0.3 });
      }
    };

    window.addEventListener('section-entered', handler as EventListener);
    return () => window.removeEventListener('section-entered', handler as EventListener);
  }, [startScrollBounce]);

  // ── Section entrance animations (main view only) ────────
  useGSAP(() => {
    const header = mainRef.current?.querySelector(`.${styles.header}`);
    const line   = mainRef.current?.querySelector(`.${styles.headerLine}`);
    const rows   = mainRef.current?.querySelectorAll(`.${styles.row}`);
    const frame  = mainRef.current?.querySelector(`.${styles.previewFrame}`);
    const meta   = mainRef.current?.querySelector(`.${styles.previewMeta}`);
    const imgs   = mainRef.current?.querySelectorAll<HTMLElement>(`.${styles.previewImg}`);


    // ProjectsV2 entra solo cuando ya se acomodó justo por debajo del Navbar
    const isSmall = window.innerWidth < 1024;
    const trigger = {
      trigger: sectionRef.current,
      start: isSmall ? 'top 80%' : 'top 15%',
      end: 'bottom 15%',
      toggleActions: isSmall ? 'play none none none' : 'play reverse play reverse',
    };

    if (header) gsap.fromTo(header, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: trigger });
    if (line)   gsap.fromTo(line,   { scaleX: 0 },           { scaleX: 1, duration: 1.5, ease: 'expo.out', transformOrigin: 'left', scrollTrigger: trigger, delay: 0.15 });

    // Simultaneous 3D fade-in for the preview frame
    if (frame) {
      gsap.fromTo(frame,
        { autoAlpha: 0, scale: 0.9, rotateY: 12, transformPerspective: 1200 },
        { autoAlpha: 1, scale: 1, rotateY: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: trigger, delay: 0.15 }
      );
    }
    if (meta) {
      gsap.fromTo(meta,
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', scrollTrigger: trigger, delay: 0.35 }
      );
    }

    // Scale images so mouse-parallax movement has room without gaps
    if (imgs?.length) gsap.set(imgs, { scale: 1.18, transformOrigin: 'center center' });

    rows?.forEach((row, i) => {
      gsap.fromTo(row,
        { y: 45, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, delay: 0.12 + i * 0.09, ease: 'expo.out', scrollTrigger: trigger }
      );
    });

    // Estado inicial oculto del indicador de scroll
    gsap.set(scrollIndicatorRef.current, { autoAlpha: 0 });

    // Mobile: reveal secuencial con triggers independientes
    if (window.innerWidth < 768) {
      const mobileCards = mobileCardsRef.current.filter(Boolean) as HTMLDivElement[];
      const mobileHdr   = mainRef.current?.querySelector<HTMLElement>(`.${styles.mobileHdr}`);
      const mobileHLine = mainRef.current?.querySelector<HTMLElement>(`.${styles.mobileHdrLine}`);

      // Header — trigger propio
      if (mobileHdr) {
        gsap.set(mobileHdr, { y: 22, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: mobileHdr,
          start: 'bottom bottom-=10',
          onEnter: () => {
            gsap.to(mobileHdr, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });
            if (mobileHLine) gsap.fromTo(mobileHLine, { scaleX: 0 },
              { scaleX: 1, duration: 1.0, ease: 'expo.out', transformOrigin: 'left', delay: 0.12 });
          },
        });
      }

      // Cards — cada card se revela al entrar individualmente al viewport
      if (mobileCards.length) {
        gsap.set(mobileCards, { y: 30, autoAlpha: 0 });
        mobileCards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            start: 'bottom bottom-=10',
            once: true,
            onEnter: () => gsap.to(card, {
              y: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out',
            }),
          });
        });
      }
    }

    // Mobile: inclinación del frame vinculada al scroll (fallback cuando no hay gyroscopio)
    if (window.innerWidth < 1024) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 3,
        onUpdate: (self) => {
          const frame = previewFrameRef.current;
          if (!frame || (window as any).__gyroActive) return;
          const tiltY = (self.progress - 0.5) * 8;
          gsap.set(frame, {
            rotateX: tiltY * -0.5,
            rotateY: tiltY,
            transformPerspective: 1000,
          });
        },
      });
    }
  }, { scope: sectionRef });

  // ── 3D tilt + mouse-parallax + glare on the preview frame ──
  // Global listener: strong effect when over frame, subtle when anywhere else
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      const frame = previewFrameRef.current;
      if (!frame) return;

      if (window.innerWidth < 1024) {
        gsap.set(frame, { rotateX: 0, rotateY: 0 });
        const imgs = Array.from(frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`));
        if (imgs.length) gsap.set(imgs, { x: 0, y: 0 });
        const glare = frame.querySelector<HTMLElement>(`.${styles.previewGlare}`);
        if (glare) gsap.set(glare, { opacity: 0 });
        return;
      }

      const rect = frame.getBoundingClientRect();
      const isOver = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isOver) {
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        gsap.to(frame, {
          rotateX: (0.5 - y) * 12,
          rotateY: (x - 0.5) * 16,
          transformPerspective: 1200,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        const imgs = Array.from(frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`));
        if (imgs.length) gsap.to(imgs, {
          x: (0.5 - x) * 25,
          y: (0.5 - y) * 17,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        const glare = frame.querySelector<HTMLElement>(`.${styles.previewGlare}`);
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.14) 0%, transparent 60%)`;
          gsap.to(glare, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        }
      } else {
        // Subtle parallax based on window-normalised coords
        const wx = e.clientX / window.innerWidth;
        const wy = e.clientY / window.innerHeight;

        gsap.to(frame, {
          rotateX: (0.5 - wy) * 4,
          rotateY: (wx - 0.5) * 5,
          transformPerspective: 1200,
          duration: 0.9,
          ease: 'expo.out',
          overwrite: 'auto',
        });

        const imgs = Array.from(frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`));
        if (imgs.length) gsap.to(imgs, {
          x: (0.5 - wx) * 10,
          y: (0.5 - wy) * 7,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });

        const glare = frame.querySelector<HTMLElement>(`.${styles.previewGlare}`);
        if (glare) gsap.to(glare, { opacity: 0, duration: 0.45, overwrite: 'auto' });
      }
    };

    window.addEventListener('mousemove', handleGlobalMove);
    return () => window.removeEventListener('mousemove', handleGlobalMove);
  }, []);

  // ── DeviceOrientation tilt para mobile (reemplaza el tilt de mouse) ─────
  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const applyOrientation = (e: DeviceOrientationEvent) => {
      const frame = previewFrameRef.current;
      if (!frame) return;

      // gamma: inclinación izquierda-derecha. beta: adelante-atrás (compensamos 45° de sostenimiento natural)
      const gamma = Math.min(Math.max(e.gamma ?? 0, -25), 25);
      const beta  = Math.min(Math.max((e.beta ?? 0) - 45, -25), 25);

      (window as any).__gyroActive = true;

      gsap.to(frame, {
        rotateX: beta  * 0.18,
        rotateY: gamma * 0.22,
        transformPerspective: 1000,
        duration: 0.7,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      const imgs = Array.from(frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`));
      if (imgs.length) gsap.to(imgs, {
        x: gamma * 0.25,
        y: beta  * 0.15,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      const glare = frame.querySelector<HTMLElement>(`.${styles.previewGlare}`);
      if (glare) {
        const gx = ((gamma + 25) / 50) * 100;
        const gy = ((beta  + 25) / 50) * 100;
        glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.10) 0%, transparent 55%)`;
        gsap.to(glare, { opacity: 0.6, duration: 0.3, overwrite: 'auto' });
      }
    };

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // El permiso se solicita desde el primer tap al frame (ver onClick del previewFrame)
      (window as any).__gyroPendingHandler = applyOrientation;
    } else {
      window.addEventListener('deviceorientation', applyOrientation, true);
      return () => {
        window.removeEventListener('deviceorientation', applyOrientation, true);
        delete (window as any).__gyroActive;
      };
    }

    return () => { delete (window as any).__gyroActive; };
  }, []);

  // ── Open project detail page ────────────────────────────
  const openProject = useCallback((project: Project) => {
    lastRef.current = project;
    setSelected(project);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Push a synthetic history entry so the browser Back button closes
    // the gallery instead of leaving the app (see popstate listener below).
    if (!(window.history.state as { projectGallery?: boolean } | null)?.projectGallery) {
      window.history.pushState({ projectGallery: true }, '');
    }

    gsap.killTweensOf([mainRef.current, detailRef.current]);
    if (scrollTlRef.current) { scrollTlRef.current.kill(); scrollTlRef.current = null; }
    gsap.to(scrollIndicatorRef.current, { autoAlpha: 0, duration: 0.25 });

    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
    gsap.set(detailRef.current, { x: 0 });

    // Fade the main list out
    gsap.to(mainRef.current, { x: '-4%', autoAlpha: 0, duration: 0.32, ease: 'power3.in' });

    // Wait two frames so React has rendered the detail content
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const header  = detailHeaderRef.current;
        const collage = firstScreenRef.current;

        // Pre-hide elements that will stagger in
        if (header) gsap.set(Array.from(header.children), { y: 18, autoAlpha: 0 });
        if (collage) {
          const label = collage.previousElementSibling;
          if (label) gsap.set(label, { y: 8, autoAlpha: 0 });
          gsap.set(Array.from(collage.querySelectorAll('button')), { y: 22, autoAlpha: 0 });
        }

        // Reveal detail overlay, then stagger elements in
        gsap.fromTo(
          detailRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.38,
            ease: 'power2.out',
            onComplete: () => {
              if (header) {
                gsap.to(Array.from(header.children), {
                  y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.09, ease: 'expo.out',
                });
              }
              if (collage) {
                const label = collage.previousElementSibling;
                if (label) {
                  gsap.to(label, { y: 0, autoAlpha: 1, duration: 0.45, delay: 0.22, ease: 'expo.out' });
                }
                gsap.to(Array.from(collage.querySelectorAll('button')), {
                  y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.055, delay: 0.3, ease: 'expo.out',
                });
              }
            },
          }
        );
      });
    });
  }, []);

  // ── Go back to projects list (actual close animation + state reset) ──
  const closeGallery = useCallback(() => {
    gsap.killTweensOf([mainRef.current, detailRef.current]);

    const tl = gsap.timeline();
    tl.to(detailRef.current, { x: '5%', autoAlpha: 0, duration: 0.38, ease: 'power3.in' })
      .fromTo(mainRef.current,
        { x: '-5%', autoAlpha: 0 },
        { x: '0%', autoAlpha: 1, duration: 0.55, ease: 'expo.out' },
        '-=0.08'
      )
      .call(() => {
      setSelected(null);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      gsap.to(scrollIndicatorRef.current, {
        autoAlpha: 1, duration: 0.6, delay: 0.3, ease: 'power2.out',
        onComplete: startScrollBounce,
      });
    });
  }, [startScrollBounce]);

  // ── UI-triggered close (buttons inside ProjectDetail): hand off to the
  // browser Back button so it stays the single source of truth for closing.
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // ── Close the gallery when the user presses the browser Back button ──
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const state = e.state as { projectGallery?: boolean } | null;
      if (!state?.projectGallery && selected) {
        closeGallery();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [selected, closeGallery]);

  const active   = projects.find(p => p.id === activeId)!;
  const detail   = selected ?? lastRef.current;

  return (
    <section id="proyectos" ref={sectionRef} className={styles.section} data-section-trigger>

      {/* ════════════════════════════════════════════
          MAIN VIEW — list + preview
          ════════════════════════════════════════════ */}
      <div ref={mainRef} className={styles.mainView}>

        {/* ── Mobile carousel (oculto en desktop) ── */}
        <div className={styles.mobileView}>
          <div className={styles.mobileHdr}>
            <div className={styles.headerLeft}>
              <span className={styles.conceptDot} />
              <span className={styles.sectionLabel}>Mis proyectos</span>
            </div>
          </div>
          <div className={styles.mobileHdrLine} />

          <div className={styles.mobileCarousel}>
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={styles.mobileCard}
                ref={(el) => { mobileCardsRef.current[i] = el; }}
                onClick={() => openProject(project)}
              >
                <img src={project.image} alt={project.title} className={styles.mobileCardBg} />
                <div className={styles.mobileCardOverlay} />
                <div className={styles.mobileCardContent}>
                  <span className={styles.mobileCardNum}>0{project.id}</span>
                  <h3 className={styles.mobileCardTitle}>{project.listTitle || project.title}</h3>
                  <div className={styles.mobileCardTags}>
                    {project.tags.map(tag => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
                <span className={styles.mobileCardArrow}>↗</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Desktop inner grid (oculto en mobile) ── */}
        <div className={styles.inner}>

          {/* Left: list */}
          <div className={styles.listCol}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.conceptDot} />
                <span className={styles.sectionLabel}>Mis proyectos</span>
              </div>
            </div>

            <div className={styles.headerLine} />

            <div className={styles.list}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`${styles.row} ${activeId === project.id ? styles.rowActive : ''}`}
                  onMouseEnter={() => { setActiveId(project.id); startCarousel(); }}
                  onClick={() => { setActiveId(project.id); openProject(project); }}
                >
                  <span className={styles.rowNum}>0{project.id}</span>
                  <div className={styles.rowInfo}>
                    <h3 className={styles.rowTitle}>{project.listTitle || project.title}</h3>
                    <p className={styles.rowDesc}>{project.description}</p>
                  </div>
                  <span className={styles.rowArrow}>↗</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: preview */}
          <div className={styles.previewCol}>
            <div
              ref={previewFrameRef}
              className={styles.previewFrame}
              onClick={() => {
                // En iOS solicita permiso de gyroscopio; en mobile abre el proyecto activo
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                if (isIOS && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                  (DeviceOrientationEvent as any).requestPermission().then((state: string) => {
                    if (state === 'granted' && (window as any).__gyroPendingHandler) {
                      window.addEventListener('deviceorientation', (window as any).__gyroPendingHandler, true);
                      (window as any).__gyroActive = true;
                    }
                  });
                }
                if (window.innerWidth < 1024) openProject(active);
              }}
            >
              <div className={styles.browserBar}>
                <div className={styles.browserDots}>
                  <span className={styles.dot} data-color="red" />
                  <span className={styles.dot} data-color="yellow" />
                  <span className={styles.dot} data-color="green" />
                </div>
                <div className={styles.browserUrl}>
                  <span className={styles.urlText}>
                    {(active.listTitle || active.title)
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9]/g, '-')
                      .replace(/-+/g, '-')
                    }.dev
                  </span>
                </div>
              </div>
              <div className={styles.imgStack}>
                {projects.map((project) => (
                  <img
                    key={project.id}
                    src={project.image}
                    alt={project.title}
                    className={`${styles.previewImg} ${activeId === project.id ? styles.previewImgVisible : ''}`}
                  />
                ))}
                <div className={styles.imgOverlay} />
              </div>
              <div className={styles.previewGlare} aria-hidden="true" />
            </div>

            <div className={styles.previewMeta}>
              <div className={styles.metaIndicators}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className={`${styles.metaDot} ${activeId === project.id ? styles.metaDotActive : ''}`}
                    onClick={() => setActiveId(project.id)}
                    aria-label={project.title}
                  />
                ))}
              </div>
              <div className={styles.metaStack}>
                {projects.map((project) => (
                  <span
                    key={project.id}
                    className={`${styles.metaTitle} ${activeId === project.id ? styles.metaTitleVisible : ''}`}
                  >
                    {project.listTitle || project.title}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <ProjectDetail
        outerRef={detailRef}
        scrollRef={scrollAreaRef}
        detail={detail}
        goBack={goBack}
        firstScreenRef={firstScreenRef}
        detailHeaderRef={detailHeaderRef}
      />

      {/* Hero clone — flies from preview to gallery on open */}
      <div ref={heroRef} className={styles.heroClone} aria-hidden="true">
        <div className={styles.heroCloneBrowserBar}>
          <span className={styles.heroCloneDot} data-color="red" />
          <span className={styles.heroCloneDot} data-color="yellow" />
          <span className={styles.heroCloneDot} data-color="green" />
        </div>
        <div className={styles.heroImgWrapper}>
          <img ref={heroImgRef} alt="" className={styles.heroImg} />
        </div>
      </div>

      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span ref={scrollTextRef} style={{ display: 'inline-block' }}>
          {'Scroll'.split('').map((char, i) => (
            <span key={i} className={styles.scrollChar} style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
        </span>
      </div>

    </section>
  );
}
