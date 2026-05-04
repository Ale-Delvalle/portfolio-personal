import React, { useRef } from 'react';
import styles from './Stack.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import cssIcon from '../../assets/stack-icons/css.svg';
import gitIcon from '../../assets/stack-icons/git.svg';
import githubIcon from '../../assets/stack-icons/github.svg';
import mongodbIcon from '../../assets/stack-icons/mongodb.svg';
import nestjsIcon from '../../assets/stack-icons/nestjs.svg';
import nodejsIcon from '../../assets/stack-icons/nodedotjs.svg';
import postgresqlIcon from '../../assets/stack-icons/postgresql.svg';
import reactIcon from '../../assets/stack-icons/react.svg';
import typescriptIcon from '../../assets/stack-icons/typescript.svg';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { id: 'typescript', name: 'TypeScript', icon: typescriptIcon, color: '#3178C6' },
  { id: 'react', name: 'React', icon: reactIcon, color: '#61DAFB' },
  { id: 'nodejs', name: 'NodeJS', icon: nodejsIcon, color: '#339933' },
  { id: 'nestjs', name: 'NestJS', icon: nestjsIcon, color: '#E0234E' },
  { id: 'postgresql', name: 'PostgreSQL', icon: postgresqlIcon, color: '#336791' },
  { id: 'mongodb', name: 'MongoDB', icon: mongodbIcon, color: '#47A248' },
  { id: 'css', name: 'CSS', icon: cssIcon, color: '#1572B6' },
  { id: 'github', name: 'GitHub', icon: githubIcon, color: '#000000' },
];

export function Stack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryStackRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });

    // Fase 1: Entrada de los iconos de izquierda a derecha (uno a uno)
    tl.fromTo(cardsRef.current,
      { y: 30, autoAlpha: 0 },
      { 
        y: 0, 
        autoAlpha: 1, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      }
    );

    // Fase 2: Inmediatamente después, se animan las letras de todos los textos a la vez
    tl.addLabel("textReveal", "+=0.1");
    cardsRef.current.forEach(card => {
      const chars = card?.querySelectorAll(`.${styles.char}`);
      if (chars && chars.length > 0) {
        tl.fromTo(chars,
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: "power2.out",
          },
          "textReveal"
        );
      }
    });

    // Animación de los elementos secundarios
    if (secondaryStackRef.current) {
      tl.fromTo(secondaryStackRef.current, 
        { y: 30, autoAlpha: 0 }, 
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
        "textReveal+=0.5"
      );
    }

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`}>
      <h2 className={styles.title}>Tecnologías</h2>
      
      <div className={styles.cardsContainer}>
        {techStack.map((tech, index) => (
          <div 
            key={tech.id} 
            className={styles.cardWrapper}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <img 
              src={tech.icon} 
              alt={tech.name} 
              style={{ filter: `drop-shadow(0 0 12px ${tech.color}99)` }}
            />
            <div className={styles.textContainer}>
              {tech.name.split('').map((char, charIndex) => (
                <span key={charIndex} className={styles.char}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
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