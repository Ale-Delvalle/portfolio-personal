import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef         = useRef<HTMLElement>(null);
  const headingRef         = useRef<HTMLHeadingElement>(null);
  const p1Ref              = useRef<HTMLParagraphElement>(null);
  const p2Ref              = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef      = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const isMobile = window.innerWidth < 1024;

    if (!isMobile) {
      // Desktop: name only visible; paragraphs hidden until scroll steps
      gsap.set([p1Ref.current, p2Ref.current], { autoAlpha: 0, y: 40 });
      gsap.set(scrollIndicatorRef.current, { autoAlpha: 1 });

      // Bouncing scroll animation (same cadence as Hero)
      const scrollTl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 0.5, repeatRefresh: true });
      scrollTl
        .to(scrollTextRef.current, { y: -12, duration: 0.3, yoyo: true, repeat: 9,  ease: 'power2.out' })
        .to(scrollTextRef.current, { y: -6,  duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' })
        .to(scrollTextRef.current, { y: -2,  duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else {
      // Mobile: natural scroll — reveal with ScrollTrigger
      gsap.set(scrollIndicatorRef.current, { autoAlpha: 0 });
      gsap.set([p1Ref.current, p2Ref.current], { autoAlpha: 0, y: 40 });

      [p1Ref.current, p2Ref.current].forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.85, delay: i * 0.25, ease: 'power3.out' });
          },
        });
      });
    }
  }, { scope: sectionRef });

  // Listen for desktop scroll-step events dispatched by App.tsx
  useEffect(() => {
    const handleStep = (e: CustomEvent<{ step: number; instant?: boolean }>) => {
      const { step, instant } = e.detail;
      const dur     = instant ? 0 : 0.85;
      const fadeDur = instant ? 0 : 0.4;

      if (step === 0) {
        gsap.to(scrollIndicatorRef.current, { autoAlpha: 1, y: 0,   duration: fadeDur });
        gsap.to(p1Ref.current,              { autoAlpha: 0, y: 40,  duration: fadeDur });
        gsap.to(p2Ref.current,              { autoAlpha: 0, y: 40,  duration: fadeDur });
      } else if (step === 1) {
        gsap.to(scrollIndicatorRef.current, { autoAlpha: 0, y: -10, duration: fadeDur });
        gsap.to(p1Ref.current,              { autoAlpha: 1, y: 0,   duration: dur, ease: 'power3.out' });
        gsap.to(p2Ref.current,              { autoAlpha: 0, y: 40,  duration: instant ? 0 : fadeDur });
      } else if (step === 2) {
        gsap.to(scrollIndicatorRef.current, { autoAlpha: 0, y: -10, duration: instant ? 0 : fadeDur });
        gsap.to(p1Ref.current,              { autoAlpha: 1, y: 0,   duration: instant ? 0 : dur, ease: 'power3.out' });
        gsap.to(p2Ref.current,              { autoAlpha: 1, y: 0,   duration: dur, ease: 'power3.out' });
      }
    };

    window.addEventListener('about-step', handleStep as EventListener);
    return () => window.removeEventListener('about-step', handleStep as EventListener);
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <h1 ref={headingRef} className={styles.heading}>
        Alexis Delvalle
      </h1>

      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span ref={scrollTextRef} style={{ display: 'inline-block' }}>
          {'Scroll'.split('').map((char, i) => (
            <span key={i} className={styles.scrollChar} style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
        </span>
      </div>

      <div className={styles.paragraphsWrapper}>
        <p ref={p1Ref} className={styles.p1}>
          Me apasiona escribir código que tenga propósito real. No me conformo
          con que las cosas simplemente funcionen — me interesa que sean claras,
          mantenibles y que aporten valor de verdad. Cada proyecto es una
          oportunidad de entender mejor cómo pensar los sistemas, no solo
          implementarlos.
        </p>
        <p ref={p2Ref} className={styles.p2}>
          Busco un equipo donde pueda contribuir y también seguir aprendiendo.
          Me importa entender por qué se construye lo que se construye, no solo
          ejecutar tareas. Disfruto los entornos con buena comunicación,
          confianza y objetivos que valen la pena.
        </p>
      </div>
    </section>
  );
}
