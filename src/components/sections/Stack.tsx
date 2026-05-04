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

    // Fase 1: Entrada desde la izquierda con fade-in y stagger
    tl.fromTo(cardsRef.current,
      { x: -100, autoAlpha: 0 },
      { 
        x: 0, 
        autoAlpha: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "back.out(1.7)" 
      }
    );

    // Fase 2: Inmediatamente después del último elemento de la fase 1,
    // se inicia el volteo de cada tarjeta con stagger
    tl.to(cardsRef.current.map(el => el?.querySelector(`.${styles.cardInner}`)), {
      rotateY: 180,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.inOut",
    }, "+=0.2"); // Pequeña pausa después de que entren todos para que se vea el flip

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
            <div className={styles.cardInner}>
              <div className={`${styles.cardFace} ${styles.cardFront}`}>
                <img 
                  src={tech.icon} 
                  alt={tech.name} 
                  style={{ filter: `drop-shadow(0 0 12px ${tech.color}99)` }}
                />
              </div>
              <div 
                className={`${styles.cardFace} ${styles.cardBack}`}
                style={{ 
                  color: tech.color, 
                  textShadow: `0 0 15px ${tech.color}80` 
                }}
              >
                {tech.name}
              </div>
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