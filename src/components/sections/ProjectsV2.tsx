import { useRef } from 'react';
import styles from './ProjectsV2.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, title: 'E-Commerce', year: '2024', tags: ['React', 'Node.js'], fromTop: true },
  { id: 2, title: 'H n P', year: '2024', tags: ['TypeScript', 'NestJS'], fromTop: false },
  { id: 3, title: 'Portfolio Básico', year: '2023', tags: ['React', 'CSS'], fromTop: true },
  { id: 4, title: 'Sistema de Turnos', year: '2024', tags: ['PostgreSQL', 'Express'], fromTop: false },
  { id: 5, title: 'Web de Películas', year: '2023', tags: ['React', 'API REST'], fromTop: true },
];

export function ProjectsV2() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const columns = sectionRef.current?.querySelectorAll(`.${styles.column}`);
    if (!columns) return;

    columns.forEach((column, index) => {
      const fromTop = projects[index].fromTop;

      gsap.fromTo(
        column,
        { y: fromTop ? '-105%' : '105%', autoAlpha: 0 },
        {
          y: '0%',
          autoAlpha: 1,
          duration: 1.4,
          delay: index * 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.conceptLabel}>
        <span className={styles.conceptDot}></span>
        PROYECTOS — VERSIÓN 2
      </div>

      <div className={styles.panelsContainer}>
        {projects.map((project) => (
          <div key={project.id} className={styles.column}>
            <span className={styles.watermarkNum}>0{project.id}</span>

            <div className={styles.columnHeader}>
              <span className={styles.projectNum}>0{project.id}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
            </div>

            <div className={styles.divider} />

            <div className={styles.columnFooter}>
              <span className={styles.year}>{project.year}</span>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <span className={styles.viewLabel}>Ver proyecto →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
