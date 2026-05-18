import { useRef, useState } from 'react';
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

const projects = [
  {
    id: 1,
    title: 'E-Commerce',
    description: 'Plataforma de compras con carrito, pagos integrados y panel de administración.',
    year: '2024',
    tags: ['React', 'Node.js'],
    image: imgEcommerce,
  },
  {
    id: 2,
    title: 'H n P',
    description: 'Aplicación empresarial con autenticación segura y gestión de recursos.',
    year: '2024',
    tags: ['TypeScript', 'NestJS'],
    image: imgHnp,
  },
  {
    id: 3,
    title: 'Portfolio Básico',
    description: 'Sitio personal con animaciones fluidas y diseño completamente responsive.',
    year: '2023',
    tags: ['React', 'CSS'],
    image: imgPortfolio,
  },
  {
    id: 4,
    title: 'Sistema de Turnos',
    description: 'Gestión de citas con calendario interactivo y notificaciones en tiempo real.',
    year: '2024',
    tags: ['PostgreSQL', 'Express'],
    image: imgTurnos,
  },
  {
    id: 5,
    title: 'Web de Películas',
    description: 'Catálogo de películas consumiendo APIs externas con filtros avanzados.',
    year: '2023',
    tags: ['React', 'API REST'],
    image: imgPeliculas,
  },
];

export function ProjectsV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(1);

  useGSAP(() => {
    const header   = sectionRef.current?.querySelector(`.${styles.header}`);
    const line     = sectionRef.current?.querySelector(`.${styles.headerLine}`);
    const rows     = sectionRef.current?.querySelectorAll(`.${styles.row}`);
    const preview  = sectionRef.current?.querySelector(`.${styles.previewCol}`);

    const trigger = {
      trigger: sectionRef.current,
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    };

    if (header) {
      gsap.fromTo(header,
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: trigger }
      );
    }

    if (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'expo.out', transformOrigin: 'left', scrollTrigger: trigger, delay: 0.15 }
      );
    }

    if (preview) {
      gsap.fromTo(preview,
        { x: 50, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: trigger, delay: 0.2 }
      );
    }

    rows?.forEach((row, i) => {
      gsap.fromTo(row,
        { y: 45, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, delay: 0.12 + i * 0.09, ease: 'expo.out', scrollTrigger: trigger }
      );
    });
  }, { scope: sectionRef });

  const active = projects.find(p => p.id === activeId)!;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>

        {/* ── Left: list ───────────────────────────── */}
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
                onMouseEnter={() => setActiveId(project.id)}
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

        {/* ── Right: preview ───────────────────────── */}
        <div className={styles.previewCol}>
          <div className={styles.previewFrame}>

            {/* Browser-chrome top bar */}
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

            {/* Stacked images — crossfade via opacity */}
            <div className={styles.imgStack}>
              {projects.map((project) => (
                <img
                  key={project.id}
                  src={project.image}
                  alt={project.title}
                  className={`${styles.previewImg} ${activeId === project.id ? styles.previewImgVisible : ''}`}
                />
              ))}
              {/* Subtle vignette overlay */}
              <div className={styles.imgOverlay} />
            </div>
          </div>

          {/* Metadata strip below frame */}
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
    </section>
  );
}
