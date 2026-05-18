import { useRef } from 'react';
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
    // 1) Fade in de la sección cuando entra en el viewport
    gsap.fromTo(sectionRef.current,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 30%",
          once: true,
        }
      }
    );

    // 2) Animación interna de los elementos (expansión de píldoras)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 30%",
      }
    });

    // Configuración inicial de las píldoras en el centro
    tl.set(cardsRef.current, { 
      xPercent: -50, 
      yPercent: -50, 
      x: 0, 
      y: 0, 
      scale: 0.01, 
      autoAlpha: 0, 
      force3D: true 
    });

    const isMobile = window.innerWidth < 768;
    const radiusX = isMobile ? window.innerWidth * 0.40 : 416;
    const radiusY = isMobile ? 155 : 208;

    const titleCenter = sectionRef.current?.querySelector(`.${styles.titleCenter}`);

    // 1) Animación del título (Simple Fade-in)
    if (titleCenter) {
      tl.fromTo(titleCenter, 
        { autoAlpha: 0, scale: 0.8 },
        { autoAlpha: 1, scale: 1, duration: 1.0, ease: "back.out(1.5)" }
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
      ease: "expo.out",
      onComplete: () => {
        // Al terminar la expansión, inicializamos la animación de flotación para cada pastilla
        cardsRef.current.forEach((card, index) => {
          const animateFloat = () => {
            if (!card) return;
            const angle = (index / techStack.length) * 2 * Math.PI - Math.PI / 2;
            const baseY = Math.sin(angle) * radiusY;
            
            gsap.to(card, {
              y: baseY + gsap.utils.random(-10, 10), // Movimiento estrictamente vertical (arriba/abajo)
              duration: gsap.utils.random(2.6, 5.2), // 30% más lento
              ease: "sine.inOut",
              onComplete: animateFloat
            });
          };
          // Iniciar la animación con un pequeño delay aleatorio para que se desincronicen
          setTimeout(animateFloat, gsap.utils.random(0, 1000));
        });
      }
    }, "-=0.5");

    // Animación de los elementos secundarios
    const secTitle = sectionRef.current?.querySelector(`.${styles.secondaryTitle}`);
    if (secTitle) {
      gsap.set(secTitle, { autoAlpha: 0 }); // Ocultarlo inicialmente
    }

    if (secondaryStackRef.current && secTitle) {
      tl.fromTo([secTitle, secondaryStackRef.current],
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: "power2.out" },
        "-=0.5"
      );
    }

    // Animación de salida: todos los elementos se desvanecen al mismo tiempo.
    // fromTo con from explícito para que el scrub pueda revertir correctamente.
    const exitTargets = [
      ...cardsRef.current.filter(Boolean),
      titleCenter,
      secTitle,
      secondaryStackRef.current,
    ].filter(Boolean);

    gsap.fromTo(exitTargets,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 70%",
          end: "bottom 20%",
          scrub: true,
        }
      }
    );

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`}>
      
      <div className={styles.circleContainer}>
        <div className={styles.titleContainer}>
          <div className={`${styles.titleLayer} ${styles.titleCenter}`}>Stack</div>
        </div>
        
        {techStack.map((tech, index) => (
          <div 
            key={tech.id} 
            className={styles.techPill}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            onMouseEnter={() => {
              if (cardsRef.current[index]) {
                gsap.to(cardsRef.current[index], { scale: 1.2, duration: 2.0, ease: "power2.out" });
              }
            }}
            onMouseLeave={() => {
              if (cardsRef.current[index]) {
                gsap.to(cardsRef.current[index], { scale: 1, duration: 2.0, ease: "power2.out" });
              }
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