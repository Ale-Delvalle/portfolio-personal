import { useRef } from 'react';
import styles from './Stack.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const row1 = ['TypeScript', 'JavaScript', 'NodeJS', 'NestJS', 'Express'];
const row2 = ['PostgreSQL', 'MongoDB', 'HTML 5', 'CSS', 'React', 'React Native'];

export function Stack() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const row1Ref    = useRef<HTMLDivElement>(null);
  const row2Ref    = useRef<HTMLDivElement>(null);
  const pillsRef   = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(() => {
    gsap.set([titleRef.current, row1Ref.current, row2Ref.current], { autoAlpha: 0, y: 32 });

    const startFloat = () => {
      pillsRef.current.forEach((pill) => {
        if (!pill) return;
        const animateFloat = () => {
          gsap.to(pill, {
            y: gsap.utils.random(-9, 9),
            duration: gsap.utils.random(2.6, 5.2),
            ease: 'sine.inOut',
            onComplete: animateFloat,
          });
        };
        setTimeout(animateFloat, gsap.utils.random(0, 800));
      });
    };

    if (window.innerWidth >= 1024) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ onComplete: startFloat });
          tl.to([titleRef.current, row1Ref.current, row2Ref.current], {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            stagger: 0.18,
            ease: 'expo.out',
          });
        },
      });
    } else {
      // Mobile: cada elemento se revela al entrar individualmente al viewport
      const elements = [titleRef.current, row1Ref.current, row2Ref.current].filter(Boolean) as HTMLElement[];
      let revealed = 0;

      elements.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: 'expo.out',
              onComplete: () => {
                revealed++;
                if (revealed >= elements.length) startFloat();
              },
            });
          },
        });
      });
    }
  }, { scope: sectionRef });

  return (
    <section id="stack" ref={sectionRef} className={`${styles.stackSection} hero-mesh-gradient`} data-section-trigger>
      <h2 ref={titleRef} className={styles.title}>STACK</h2>

      <div className={styles.pillsWrapper}>
        <div ref={row1Ref} className={styles.pillRow}>
          {row1.map((tech, i) => (
            <span
              key={tech}
              className={styles.pill}
              ref={(el) => { pillsRef.current[i] = el; }}
            >
              {tech}
            </span>
          ))}
        </div>
        <div ref={row2Ref} className={styles.pillRow}>
          {row2.map((tech, i) => (
            <span
              key={tech}
              className={styles.pill}
              ref={(el) => { pillsRef.current[row1.length + i] = el; }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
