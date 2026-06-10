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

  // Mobile grid refs
  const mobileTitleRef = useRef<HTMLHeadingElement>(null);
  const mobilePillsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isMobile = window.innerWidth < 1024;

    // ── MOBILE PATH: grid de pills con reveal secuencial por elemento ────
    if (isMobile) {
      const pills    = mobilePillsRef.current.filter(Boolean) as HTMLDivElement[];
      const secTitle = sectionRef.current?.querySelector<HTMLElement>(`.${styles.secondaryTitle}`);

      // Estados iniciales invisibles
      gsap.set(mobileTitleRef.current, { autoAlpha: 0, y: 28 });
      gsap.set(pills, { autoAlpha: 0, y: 22 });
      if (secTitle)                  gsap.set(secTitle, { autoAlpha: 0, y: 20 });
      if (secondaryStackRef.current) gsap.set(secondaryStackRef.current, { autoAlpha: 0, y: 20 });

      // Título — trigger propio (aparece cuando el título entra en vista)
      if (mobileTitleRef.current) {
        gsap.to(mobileTitleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: mobileTitleRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Pills — reveal por filas de 2 (cada fila tiene su propio trigger)
      const rowCount = Math.ceil(pills.length / 2);
      for (let row = 0; row < rowCount; row++) {
        const rowPills = pills.slice(row * 2, row * 2 + 2);
        if (!rowPills[0]) continue;
        gsap.to(rowPills, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.08,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: rowPills[0],
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        });
      }

      // Tecnologías secundarias — trigger propio
      if (secTitle) {
        gsap.to(
          [secTitle, secondaryStackRef.current].filter(Boolean) as HTMLElement[],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: secTitle,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      return; // omitir lógica orbital del desktop
    }
    // ─────────────────────────────────────────────────────────────────────
    
    // Escala menor en móviles para evitar colisiones
    const pillScale = isMobile ? 0.78 : 1.0;

    const radiusX  = isMobile ? Math.min(window.innerWidth * 0.36, 130) : (isTablet ? 300 : 416);
    const radiusY  = isMobile ? Math.min(window.innerWidth * 0.28, 105) : (isTablet ? 160 : 208);

    const titleCenter = sectionRef.current?.querySelector<HTMLElement>(`.${styles.titleCenter}`);
    const secTitle    = sectionRef.current?.querySelector<HTMLElement>(`.${styles.secondaryTitle}`);

    // Estados iniciales (sin ScrollTrigger, se aplican de inmediato)
    gsap.set(cardsRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.01, autoAlpha: 0, force3D: true });
    if (titleCenter)              gsap.set(titleCenter, { autoAlpha: 0, scale: 0.8 });
    if (secTitle)                 gsap.set(secTitle, { autoAlpha: 0, y: 30 });
    if (secondaryStackRef.current) gsap.set(secondaryStackRef.current, { autoAlpha: 0, y: 30 });

    const orbitEnabled = { value: false };
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        playedRef.current = true;
        orbitEnabled.value = true;
        if (!isMobile) {
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
        }
      },
    });

    if (titleCenter) {
      tl.to(titleCenter, { autoAlpha: 1, scale: 1, duration: 1.0, ease: 'back.out(1.5)' });
    }

    tl.to(cardsRef.current, {
      x: (i) => Math.cos((i / techStack.length) * 2 * Math.PI - Math.PI / 2) * radiusX,
      y: (i) => Math.sin((i / techStack.length) * 2 * Math.PI - Math.PI / 2) * radiusY,
      scale: pillScale,
      autoAlpha: 1,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
    }, '-=0.5');

    if (secTitle && secondaryStackRef.current) {
      tl.to([secTitle, secondaryStackRef.current], {
        y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2, ease: 'power2.out',
      }, '-=0.5');
    }

    // Mobile: orbit en useGSAP scope — se crea una sola vez y se limpia al desmontar
    if (isMobile) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2.5,
        onUpdate: (self) => {
          if (!orbitEnabled.value) return;
          const delta = self.progress * Math.PI * 1.5;
          cardsRef.current.forEach((card, i) => {
            if (!card) return;
            const baseAngle = (i / techStack.length) * 2 * Math.PI - Math.PI / 2;
            const a = baseAngle + delta;
            gsap.set(card, {
              x: Math.cos(a) * radiusX,
              y: Math.sin(a) * radiusY,
            });
          });
        },
      });
    }

    // Stack entra solo cuando ya se acomodó justo por debajo del Navbar
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: window.innerWidth < 1024 ? 'top 80%' : 'top 15%',
      end: 'bottom 15%',
      onRefresh: (self) => {
        if ((self.isActive || self.progress > 0) && !playedRef.current) {
          tl.play();
        }
      },
      onEnter: () => {
        if (!playedRef.current) {
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
        if (window.innerWidth < 1024) return;
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
        if (window.innerWidth < 1024) return;
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
    <section id="stack" ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`} data-section-trigger>

      {/* ── Desktop orbital (oculto en mobile) ── */}
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
              const currentMobile = window.innerWidth < 768;
              const currentScale = currentMobile ? 0.78 : 1.0;
              if (cardsRef.current[index])
                gsap.to(cardsRef.current[index], { scale: currentScale * 1.15, duration: 0.3, ease: 'power2.out' });
            }}
            onMouseLeave={() => {
              const currentMobile = window.innerWidth < 768;
              const currentScale = currentMobile ? 0.78 : 1.0;
              if (cardsRef.current[index])
                gsap.to(cardsRef.current[index], { scale: currentScale, duration: 0.3, ease: 'power2.out' });
            }}
          >
            {tech.name}
          </div>
        ))}
      </div>

      {/* ── Mobile grid (oculto en desktop) ── */}
      <div className={styles.mobilePillGrid}>
        <h2 ref={mobileTitleRef} className={styles.mobilePillTitle}>Stack</h2>
        <div className={styles.mobilePillsContainer}>
          {techStack.map((tech, index) => (
            <div
              key={tech.id}
              className={styles.mobilePill}
              ref={(el) => { mobilePillsRef.current[index] = el; }}
            >
              {tech.name}
            </div>
          ))}
        </div>
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
