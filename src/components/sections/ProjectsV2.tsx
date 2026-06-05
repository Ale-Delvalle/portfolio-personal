import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ProjectsV2.module.css';
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
  description: string;
  year: string;
  tags: string[];
  image: string;
  screenshots: string[];
};

const projects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce',
    description: 'Plataforma de compras con carrito, pagos integrados y panel de administración completo.',
    year: '2024',
    tags: ['React', 'Node.js'],
    image: ec1,
    screenshots: [ec1, ec2, ec3, ec4, ec5, ec6, ec7, ec8],
  },
  {
    id: 2,
    title: 'H n P',
    description: 'Aplicación empresarial con autenticación segura y gestión de recursos.',
    year: '2024',
    tags: ['TypeScript', 'NestJS'],
    image: hnp1,
    screenshots: [hnp1, hnp2, hnp3, hnp4],
  },
  {
    id: 3,
    title: 'Portfolio Básico',
    description: 'Sitio personal con animaciones fluidas y diseño completamente responsive.',
    year: '2023',
    tags: ['React', 'CSS'],
    image: pb1,
    screenshots: [pb1, pb2],
  },
  {
    id: 4,
    title: 'Sistema de Turnos',
    description: 'Gestión de citas con calendario interactivo y notificaciones en tiempo real.',
    year: '2024',
    tags: ['PostgreSQL', 'Express'],
    image: st1,
    screenshots: [st1, st2, st3, st4],
  },
  {
    id: 5,
    title: 'Web de Películas',
    description: 'Catálogo de películas consumiendo APIs externas con filtros avanzados.',
    year: '2023',
    tags: ['React', 'API REST'],
    image: wp1,
    screenshots: [wp1, wp2, wp3, wp4, wp5],
  },
];

export function ProjectsV2() {
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
  const lastRef     = useRef<Project | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          start: 'top 90%',
          onEnter: () => {
            gsap.to(mobileHdr, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });
            if (mobileHLine) gsap.fromTo(mobileHLine, { scaleX: 0 },
              { scaleX: 1, duration: 1.0, ease: 'expo.out', transformOrigin: 'left', delay: 0.12 });
          },
        });
      }

      // Cards — trigger en el carousel, stagger pronunciado para sentir la secuencia
      const carousel = mainRef.current?.querySelector<HTMLElement>(`.${styles.mobileCarousel}`);
      if (carousel && mobileCards.length) {
        gsap.set(mobileCards, { y: 30, autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: carousel,
          start: 'top 88%',
          onEnter: () => gsap.to(mobileCards, {
            y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.13, ease: 'expo.out',
          }),
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
      // En mobile (<768px) el previewFrame está oculto — no animar
      if (window.innerWidth < 768) return;
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

  // ── Go back to projects list ────────────────────────────
  const goBack = useCallback(() => {
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
      gsap.to(scrollIndicatorRef.current, {
        autoAlpha: 1, duration: 0.6, delay: 0.3, ease: 'power2.out',
        onComplete: startScrollBounce,
      });
    });
  }, []);

  const active   = projects.find(p => p.id === activeId)!;
  const detail   = selected ?? lastRef.current;

  return (
    <section id="proyectos" ref={sectionRef} className={styles.section}>

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
                  <h3 className={styles.mobileCardTitle}>{project.title}</h3>
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
                    <h3 className={styles.rowTitle}>{project.title}</h3>
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
                  <span className={styles.urlText}>{active.title.toLowerCase().replace(/\s/g, '-')}.dev</span>
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
                    {project.title}
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
