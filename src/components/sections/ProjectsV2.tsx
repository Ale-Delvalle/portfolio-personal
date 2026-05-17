import { useRef, useState } from 'react';
import styles from './ProjectsV2.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ecommerceImg from '../../assets/projects/ecommerce.png';
import hnpImg from '../../assets/projects/hnp.png';
import portfolioImg from '../../assets/projects/portfolio-basico.jpg';
import turnosImg from '../../assets/projects/sistema-turnos.jpg';
import peliculasImg from '../../assets/projects/web-peliculas.jpg';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'E-Commerce', image: ecommerceImg, tags: ['React', 'Node.js'] },
  { id: 2, title: 'H n P', image: hnpImg, tags: ['TypeScript', 'NestJS'] },
  { id: 3, title: 'Portfolio', image: portfolioImg, tags: ['React', 'CSS'] },
  { id: 4, title: 'Sis. de Turnos', image: turnosImg, tags: ['PostgreSQL', 'Express'] },
  { id: 5, title: 'Web de Películas', image: peliculasImg, tags: ['React', 'API REST'] },
];

export function ProjectsV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      `.${styles.panelsContainer}`,
      { autoAlpha: 0, y: 60 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.conceptLabel}>
        <span className={styles.conceptDot}></span>
        PROYECTOS — VERSIÓN 2
      </div>

      <div className={styles.panelsContainer}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`${styles.panel} ${activePanel === index ? styles.panelActive : ''}`}
            onMouseEnter={() => setActivePanel(index)}
          >
            <div
              className={styles.panelBg}
              style={{ backgroundImage: `url(${project.image})` }}
            ></div>
            <div className={styles.overlay}></div>

            {/* Content when inactive: vertical title */}
            <div className={styles.inactiveContent}>
              <span className={styles.inactiveTitle}>{project.title}</span>
            </div>

            {/* Content when active */}
            <div className={styles.activeContent}>
              <span className={styles.projectNum}>0{project.id}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <button className={styles.viewBtn}>Ver proyecto →</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
