import { useRef } from 'react';
import styles from './Projects.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    title: 'Evervault',
    description: 'Flexible Payments Security. Maximum protection, minimum compliance burden.',
    styleClass: styles.card1,
    buttonText: 'Talk to an Expert'
  },
  {
    id: 2,
    title: 'Carrot',
    description: 'Closing the circularity gap by rewarding sustainable behaviour.',
    styleClass: styles.card2,
    buttonText: 'Get in touch!'
  },
  {
    id: 3,
    title: 'SEEN',
    description: 'A new way to open your chats and connect.',
    styleClass: styles.card3,
    buttonText: 'Open Your Chats'
  },
  {
    id: 4,
    title: 'Phantom',
    description: 'Your home for trading crypto, predictions, and more.',
    styleClass: styles.card4,
    buttonText: 'Download Phantom'
  }
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Título fade up
    gsap.fromTo(`.${styles.sectionTitle}`,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.titleWrapper}`,
          start: "top 80%",
        }
      }
    );

    // Tarjetas fade and scale up en scroll
    const cards = gsap.utils.toArray(`.${styles.projectCard}`);
    
    cards.forEach((card: any, index) => {
      // Ajuste de stagger visual basado en la columna
      const delay = index % 2 === 0 ? 0 : 0.2;

      gsap.fromTo(card,
        { autoAlpha: 0, y: 100, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          delay: delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Se revela cuando la tarjeta entra al 85% del viewport
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.projectsSection}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.sectionTitle}>Selected Projects</h2>
      </div>

      <div className={styles.gridContainer}>
        {/* Columna Izquierda: Proyectos 1 y 2 */}
        <div className={styles.leftColumn}>
          {projectsData.slice(0, 2).map((project) => (
            <div key={project.id} className={`${styles.projectCard} ${project.styleClass}`}>
              <div className={styles.cardInner}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                </div>
                <div className={styles.cardBgGraphic}></div>
                <button className={styles.exploreButton}>{project.buttonText}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha: Proyectos 3 y 4 */}
        <div className={styles.rightColumn}>
          {projectsData.slice(2, 4).map((project) => (
            <div key={project.id} className={`${styles.projectCard} ${project.styleClass}`}>
              <div className={styles.cardInner}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>
                </div>
                <div className={styles.cardBgGraphic}></div>
                <button className={styles.exploreButton}>{project.buttonText}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
