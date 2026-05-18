import { useRef, useState, useCallback, useEffect } from 'react';
import styles from './ProjectsV2.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import imgEcommerce from '../../assets/projects/ecommerce.png';
import imgHnp from '../../assets/projects/hnp.png';
import imgPortfolio from '../../assets/projects/portfolio-basico.jpg';
import imgTurnos from '../../assets/projects/sistema-turnos.jpg';
import imgPeliculas from '../../assets/projects/web-peliculas.jpg';

gsap.registerPlugin(ScrollTrigger);

type Project = {
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
    const header  = mainRef.current?.querySelector(`.${styles.header}`);
    const line    = mainRef.current?.querySelector(`.${styles.headerLine}`);
    const rows    = mainRef.current?.querySelectorAll(`.${styles.row}`);
    const preview = mainRef.current?.querySelector(`.${styles.previewCol}`);

    const trigger = {
      trigger: sectionRef.current,
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    };

    if (header)  gsap.fromTo(header,  { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9,  ease: 'expo.out', scrollTrigger: trigger });
    if (line)    gsap.fromTo(line,    { scaleX: 0 },            { scaleX: 1, duration: 1.5, ease: 'expo.out', transformOrigin: 'left', scrollTrigger: trigger, delay: 0.15 });
    if (preview) gsap.fromTo(preview, { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.1,  ease: 'expo.out', scrollTrigger: trigger, delay: 0.2 });

    rows?.forEach((row, i) => {
      gsap.fromTo(row,
        { y: 45, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, delay: 0.12 + i * 0.09, ease: 'expo.out', scrollTrigger: trigger }
      );
    });
  }, { scope: sectionRef });

  // ── Open project detail page ────────────────────────────
  const openProject = useCallback((project: Project) => {
    lastRef.current = project;
    setSelected(project);

    document.body.style.overflow = 'hidden';
    gsap.killTweensOf([mainRef.current, detailRef.current]);

    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;

    const tl = gsap.timeline();
    tl.to(mainRef.current, { x: '-5%', autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
      .fromTo(detailRef.current,
        { x: '5%', autoAlpha: 0 },
        { x: '0%', autoAlpha: 1, duration: 0.58, ease: 'expo.out' },
        '-=0.1'
      );
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
    <section ref={sectionRef} className={styles.section}>

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
            <div className={styles.previewFrame}>
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

      {/* ════════════════════════════════════════════
          DETAIL VIEW — full viewport overlay
          ════════════════════════════════════════════ */}
      <div ref={detailRef} className={styles.detailView}>
        {detail && (
          <>
            {/* Scrollable content area */}
            <div ref={scrollAreaRef} className={styles.detailScrollArea}>

              {/* Centered header: title, description, tags */}
              <div className={styles.detailHeader}>
                <h2 className={styles.detailTitle}>{detail.title}</h2>
                <p className={styles.detailDesc}>{detail.description}</p>
                <div className={styles.detailTags}>
                  {detail.tags.map(tag => (
                    <span key={tag} className={styles.detailTag}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Screenshots at 85% width */}
              <div className={styles.detailGallery}>
                {detail.screenshots.map((src, i) => (
                  <div key={i} className={styles.detailScreenshot}>
                    <div className={styles.detailBrowserBar}>
                      <span className={styles.detailMacDot} data-color="red"    />
                      <span className={styles.detailMacDot} data-color="yellow" />
                      <span className={styles.detailMacDot} data-color="green"  />
                      <span className={styles.detailBrowserUrl}>
                        {detail.title.toLowerCase().replace(/\s/g, '-')}.dev
                      </span>
                    </div>
                    <img
                      src={src}
                      alt={`${detail.title} — pantalla ${i + 1}`}
                      className={styles.detailScreenshotImg}
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Back button pinned to bottom-left */}
            <div className={styles.backBtnWrapper}>
              <button className={styles.backBtn} onClick={goBack}>
                <span className={styles.backArrow}>←</span>
                Volver a la sección de proyectos
              </button>
            </div>
          </>
        )}
      </div>

    </section>
  );
}
