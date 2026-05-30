import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ProjectsV2.module.css';
import { ProjectDetail } from './ProjectDetail';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import imgEcommerce from '../../assets/projects/ecommerce.png';
import imgHnp from '../../assets/projects/hnp.png';
import imgPortfolio from '../../assets/projects/portfolio-basico.jpg';
import imgTurnos from '../../assets/projects/sistema-turnos.jpg';
import imgPeliculas from '../../assets/projects/web-peliculas.jpg';

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
    image: imgEcommerce,
    screenshots: [imgEcommerce],
  },
  {
    id: 2,
    title: 'H n P',
    description: 'Aplicación empresarial con autenticación segura y gestión de recursos.',
    year: '2024',
    tags: ['TypeScript', 'NestJS'],
    image: imgHnp,
    screenshots: [imgHnp],
  },
  {
    id: 3,
    title: 'Portfolio Básico',
    description: 'Sitio personal con animaciones fluidas y diseño completamente responsive.',
    year: '2023',
    tags: ['React', 'CSS'],
    image: imgPortfolio,
    screenshots: [imgPortfolio],
  },
  {
    id: 4,
    title: 'Sistema de Turnos',
    description: 'Gestión de citas con calendario interactivo y notificaciones en tiempo real.',
    year: '2024',
    tags: ['PostgreSQL', 'Express'],
    image: imgTurnos,
    screenshots: [imgTurnos],
  },
  {
    id: 5,
    title: 'Web de Películas',
    description: 'Catálogo de películas consumiendo APIs externas con filtros avanzados.',
    year: '2023',
    tags: ['React', 'API REST'],
    image: imgPeliculas,
    screenshots: [imgPeliculas],
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

  // ── Section entrance animations (main view only) ────────
  useGSAP(() => {
    const header = mainRef.current?.querySelector(`.${styles.header}`);
    const line   = mainRef.current?.querySelector(`.${styles.headerLine}`);
    const rows   = mainRef.current?.querySelectorAll(`.${styles.row}`);
    const frame  = mainRef.current?.querySelector(`.${styles.previewFrame}`);
    const meta   = mainRef.current?.querySelector(`.${styles.previewMeta}`);
    const imgs   = mainRef.current?.querySelectorAll<HTMLElement>(`.${styles.previewImg}`);


    // ProjectsV2 entra solo cuando ya se acomodó justo por debajo del Navbar
    const trigger = {
      trigger: sectionRef.current,
      start: 'top 15%',
      end: 'bottom 15%',
      toggleActions: 'play reverse play reverse',
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
  }, { scope: sectionRef });

  // ── 3D tilt + mouse-parallax + glare on the preview frame ──
  // Global listener: strong effect when over frame, subtle when anywhere else
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      const frame = previewFrameRef.current;
      if (!frame) return;

      if (window.innerWidth < 1024) {
        gsap.set(frame, { rotateX: 0, rotateY: 0 });
        const imgs = frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`);
        gsap.set(imgs, { x: 0, y: 0 });
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

        const imgs = frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`);
        gsap.to(imgs, {
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

        const imgs = frame.querySelectorAll<HTMLElement>(`.${styles.previewImg}`);
        gsap.to(imgs, {
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

  // ── Open project detail page ────────────────────────────
  const openProject = useCallback((project: Project) => {
    lastRef.current = project;

    const sourceRect = previewFrameRef.current?.getBoundingClientRect();

    setSelected(project);
    document.body.style.overflow = 'hidden';
    gsap.killTweensOf([mainRef.current, detailRef.current, heroRef.current]);

    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
    gsap.set(detailRef.current, { x: 0 });

    if (!sourceRect || !heroRef.current || !heroImgRef.current) {
      const tl = gsap.timeline();
      tl.to(mainRef.current, { x: '-5%', autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
        .fromTo(detailRef.current,
          { x: '5%', autoAlpha: 0 },
          { x: '0%', autoAlpha: 1, duration: 0.58, ease: 'expo.out' },
          '-=0.1'
        );
      return;
    }

    const hero    = heroRef.current;
    const heroImg = heroImgRef.current;

    heroImg.src = project.image;
    gsap.set(hero, {
      display: 'flex',
      left:    sourceRect.left,
      top:     sourceRect.top,
      width:   sourceRect.width,
      height:  sourceRect.height,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const firstScreen = firstScreenRef.current;
        const header      = detailHeaderRef.current;

        if (!firstScreen || !header) {
          gsap.set(hero, { display: 'none' });
          const tl = gsap.timeline();
          tl.to(mainRef.current, { x: '-5%', autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
            .fromTo(detailRef.current,
              { x: '5%', autoAlpha: 0 },
              { x: '0%', autoAlpha: 1, duration: 0.58, ease: 'expo.out' },
              '-=0.1'
            );
          return;
        }

        const targetRect = firstScreen.getBoundingClientRect();

        gsap.set(header,      { autoAlpha: 0 });
        gsap.set(firstScreen, { opacity: 0 });

        const tl = gsap.timeline();
        tl
          .to(mainRef.current, { x: '-5%', autoAlpha: 0, duration: 0.45, ease: 'power3.in' }, 0)
          .fromTo(detailRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.45, ease: 'power2.inOut' },
            0.1
          )
          .to(hero, {
            left:   targetRect.left,
            top:    targetRect.top,
            width:  targetRect.width,
            height: targetRect.height,
            duration: 0.62,
            ease:     'expo.out',
          }, 0.15)
          .call(() => {
            gsap.set(firstScreen, { opacity: 1 });
            gsap.set(hero, { display: 'none' });
          })
          .fromTo(header,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }
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
      .call(() => { setSelected(null); document.body.style.overflow = ''; });
  }, []);

  const active   = projects.find(p => p.id === activeId)!;
  const detail   = selected ?? lastRef.current;

  return (
    <section id="proyectos" ref={sectionRef} className={styles.section}>

      {/* ════════════════════════════════════════════
          MAIN VIEW — list + preview
          ════════════════════════════════════════════ */}
      <div ref={mainRef} className={styles.mainView}>
        <div className={styles.inner}>

          {/* Left: list */}
          <div className={styles.listCol}>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.conceptDot} />
                <span className={styles.sectionLabel}>PROYECTOS</span>
              </div>
              <span className={styles.counter}>05</span>
            </div>

            <div className={styles.headerLine} />

            <div className={styles.list}>
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={styles.row}
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
          <img ref={heroImgRef} src="" alt="" className={styles.heroImg} />
        </div>
      </div>

    </section>
  );
}
