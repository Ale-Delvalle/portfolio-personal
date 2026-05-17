import { useRef } from 'react';
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
  { id: 1, title: 'E-Commerce', image: ecommerceImg, fromTop: true },
  { id: 2, title: 'H n P', image: hnpImg, fromTop: false },
  { id: 3, title: 'Portfolio Básico', image: portfolioImg, fromTop: true },
  { id: 4, title: 'Sistema de Turnos', image: turnosImg, fromTop: false },
  { id: 5, title: 'Web de Películas', image: peliculasImg, fromTop: true },
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
            <div
              className={styles.columnBg}
              style={{ backgroundImage: `url(${project.image})` }}
            ></div>
            <div className={styles.overlay}></div>
            <div className={styles.columnContent}>
              <span className={styles.projectNum}>0{project.id}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <span className={styles.viewLabel}>Ver proyecto →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
