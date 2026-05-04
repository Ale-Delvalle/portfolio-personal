import React, { useRef } from 'react';
import styles from './Stack.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
  { id: 'react', name: 'React', color: '#61DAFB' },
  { id: 'nodejs', name: 'NodeJS', color: '#339933' },
  { id: 'nestjs', name: 'NestJS', color: '#E0234E' },
  { id: 'postgresql', name: 'PostgreSQL', color: '#336791' },
  { id: 'mongodb', name: 'MongoDB', color: '#47A248' },
  { id: 'css', name: 'CSS', color: '#1572B6' },
  { id: 'github', name: 'GitHub', color: '#000000' },
];

export function Stack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryStackRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      }
    });

    // Configuración inicial de las píldoras en el centro
    tl.set(cardsRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0, autoAlpha: 0 });

    const isMobile = window.innerWidth < 768;
    const radiusX = isMobile ? window.innerWidth * 0.38 : 320;
    const radiusY = isMobile ? 220 : 160;

    // Entrada del título central
    const title = sectionRef.current?.querySelector(`.${styles.centerTitle}`);
    if (title) {
      tl.fromTo(title, 
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 1, ease: "back.out(1.5)" }
      );
    }

    // Animación de expansión de las píldoras de texto formando un óvalo
    tl.to(cardsRef.current, {
      x: (index) => {
        const angle = (index / techStack.length) * 2 * Math.PI - Math.PI / 2;
        return Math.cos(angle) * radiusX;
      },
      y: (index) => {
        const angle = (index / techStack.length) * 2 * Math.PI - Math.PI / 2;
        return Math.sin(angle) * radiusY;
      },
      scale: 1,
      autoAlpha: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out"
    }, "-=0.5");

    // Animación de los elementos secundarios
    if (secondaryStackRef.current) {
      tl.fromTo(secondaryStackRef.current, 
        { y: 30, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`}>
      
      <div className={styles.circleContainer}>
        <h2 className={styles.centerTitle}>Stack</h2>
        
        {techStack.map((tech, index) => (
          <div 
            key={tech.id} 
            className={styles.techPill}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            style={{ 
              boxShadow: `0 8px 24px ${tech.color}40`,
              border: `1px solid ${tech.color}40` 
            }}
          >
            {tech.name}
          </div>
        ))}
      </div>

      <h3 className={styles.secondaryTitle}>También he trabajado en algunos proyectos puntuales con:</h3>
      <section ref={secondaryStackRef} className={styles.secondaryStack}>
        <p>Electrón</p>
        <p>Google APIs</p>
        <p>Express</p>
        <p>Tailwind</p>
        <p>React Native</p>
      </section>
    </section>
  );
}