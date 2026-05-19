import { useRef } from 'react';
import styles from './Stack.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { id: 'typescript', name: 'TypeScript', color: '#3178C6' },
  { id: 'react',      name: 'React',      color: '#61DAFB' },
  { id: 'nodejs',     name: 'NodeJS',     color: '#339933' },
  { id: 'nestjs',     name: 'NestJS',     color: '#E0234E' },
  { id: 'postgresql', name: 'PostgreSQL', color: '#336791' },
  { id: 'mongodb',    name: 'MongoDB',    color: '#47A248' },
  { id: 'css',        name: 'CSS',        color: '#1572B6' },
  { id: 'github',     name: 'GitHub',     color: '#000000' },
];

export function Stack() {
  const sectionRef         = useRef<HTMLElement>(null);
  const circleContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef           = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryStackRef  = useRef<HTMLElement>(null);
  const playedRef          = useRef(false);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;
    const radiusX  = isMobile ? window.innerWidth * 0.40 : 416;
    const radiusY  = isMobile ? 155 : 208;

    const titleCenter = sectionRef.current?.querySelector<HTMLElement>(`.${styles.titleCenter}`);
    const secTitle    = sectionRef.current?.querySelector<HTMLElement>(`.${styles.secondaryTitle}`);

    // Estados iniciales (sin ScrollTrigger, se aplican de inmediato)
    gsap.set(cardsRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.01, autoAlpha: 0, force3D: true });
    if (titleCenter)              gsap.set(titleCenter, { autoAlpha: 0, scale: 0.8 });
    if (secTitle)                 gsap.set(secTitle, { autoAlpha: 0, y: 30 });
    if (secondaryStackRef.current) gsap.set(secondaryStackRef.current, { autoAlpha: 0, y: 30 });

    const tl = gsap.timeline({ paused: true });

    if (titleCenter) {
      tl.to(titleCenter, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'back.out(1.5)' });
    }

    tl.to(cardsRef.current, {
      x: (i) => Math.cos((i / techStack.length) * 2 * Math.PI - Math.PI / 2) * radiusX,
      y: (i) => Math.sin((i / techStack.length) * 2 * Math.PI - Math.PI / 2) * radiusY,
      scale: 1,
      autoAlpha: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
      onComplete: () => {
        cardsRef.current.forEach((card, i) => {
          const animateFloat = () => {
            if (!card) return;
            const baseY = Math.sin((i / techStack.length) * 2 * Math.PI - Math.PI / 2) * radiusY;
            gsap.to(card, {
              y: baseY + gsap.utils.random(-10, 10),
              duration: gsap.utils.random(2.6, 5.2),
              ease: 'sine.inOut',
              onComplete: animateFloat,
            });
          };
          setTimeout(animateFloat, gsap.utils.random(0, 1000));
        });
      },
    }, '-=0.5');

    if (secTitle && secondaryStackRef.current) {
      tl.to([secTitle, secondaryStackRef.current], {
        y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out',
      }, '-=0.5');
    }


    // Stack entra solo cuando ya se acomodó justo por debajo del Navbar
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 15%',
      end: 'bottom 15%',
      onEnter: () => {
        if (!playedRef.current) {
          playedRef.current = true;
          tl.play();
        } else {
          // Segunda vez en adelante: animación de entrada tipo ProjectsV2
          const elements = [circleContainerRef.current, secTitle, secondaryStackRef.current].filter(Boolean);
          gsap.fromTo(elements,
            { y: 45, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.15, ease: 'expo.out', overwrite: 'auto' }
          );
        }
      },
      onLeave: () => {
        if (playedRef.current) {
          // Animación de salida cuando se pasa de largo hacia abajo
          const elements = [circleContainerRef.current, secTitle, secondaryStackRef.current].filter(Boolean);
          gsap.to(elements,
            { y: -45, autoAlpha: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' }
          );
        }
      },
      onEnterBack: () => {
        if (playedRef.current) {
          // Animación de entrada al volver desde abajo
          const elements = [circleContainerRef.current, secTitle, secondaryStackRef.current].filter(Boolean);
          gsap.fromTo(elements,
            { y: -45, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.15, ease: 'expo.out', overwrite: 'auto' }
          );
        }
      },
      onLeaveBack: () => {
        if (playedRef.current) {
          // Animación de salida tipo ProjectsV2 al volver hacia arriba
          const elements = [circleContainerRef.current, secTitle, secondaryStackRef.current].filter(Boolean);
          gsap.to(elements,
            { y: 45, autoAlpha: 0, duration: 0.5, ease: 'expo.out', overwrite: 'auto' }
          );
        }
      }
    });

  }, { scope: sectionRef });

  return (
    <section id="stack" ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`}>

      <div ref={circleContainerRef} className={styles.circleContainer}>
        <div className={styles.titleContainer}>
          <div className={`${styles.titleLayer} ${styles.titleCenter}`}>Stack</div>
        </div>

        {techStack.map((tech, index) => (
          <div
            key={tech.id}
            className={styles.techPill}
            ref={(el) => { cardsRef.current[index] = el; }}
            onMouseEnter={() => {
              if (cardsRef.current[index])
                gsap.to(cardsRef.current[index], { scale: 1.2, duration: 2.0, ease: 'power2.out' });
            }}
            onMouseLeave={() => {
              if (cardsRef.current[index])
                gsap.to(cardsRef.current[index], { scale: 1, duration: 2.0, ease: 'power2.out' });
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
