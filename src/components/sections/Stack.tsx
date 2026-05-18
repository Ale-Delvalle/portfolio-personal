import { useRef, useEffect } from 'react';
import styles from './Stack.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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
  const sectionRef       = useRef<HTMLElement>(null);
  const cardsRef         = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryStackRef = useRef<HTMLElement>(null);
  const tlRef            = useRef<gsap.core.Timeline | null>(null);
  const playedRef        = useRef(false);

  // Construye el timeline pausado y aplica los estados iniciales
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
    tlRef.current = tl;

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
  }, { scope: sectionRef });

  // IntersectionObserver: dispara el timeline cuando la sección es visible,
  // independientemente de si el scroll fue suave o instantáneo.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !playedRef.current) {
          playedRef.current = true;
          tlRef.current?.play();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`}>

      <div className={styles.circleContainer}>
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
