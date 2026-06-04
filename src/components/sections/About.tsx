import { useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './About.module.css';

export function About() {
  const sectionRef         = useRef<HTMLElement>(null);
  const headingRef         = useRef<HTMLHeadingElement>(null);
  const p1Ref              = useRef<HTMLParagraphElement>(null);
  const p2Ref              = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef      = useRef<HTMLSpanElement>(null);
  const scrollTlRef        = useRef<gsap.core.Timeline | null>(null);
  const seqTlRef           = useRef<gsap.core.Timeline | null>(null);

  // Initial hidden state (CSS ya tiene opacity:0 para el indicador)
  useGSAP(() => {
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current], { autoAlpha: 0, y: 30 });
  }, { scope: sectionRef });

  // Bounce animation — identical to Hero
  const startScrollBounce = useCallback(() => {
    if (scrollTlRef.current) scrollTlRef.current.kill();
    gsap.set(scrollTextRef.current, { y: 0 });
    scrollTlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 2, repeatRefresh: true });
    scrollTlRef.current
      .to(scrollTextRef.current, { y: -12, duration: 0.3,  yoyo: true, repeat: 9,  ease: 'power2.out' })
      .to(scrollTextRef.current, { y: -6,  duration: 0.25, yoyo: true, repeat: 1,  ease: 'power2.out' })
      .to(scrollTextRef.current, { y: -2,  duration: 0.15, yoyo: true, repeat: 1,  ease: 'power2.out' });
  }, []);

  const playAll = useCallback(() => {
    if (seqTlRef.current) seqTlRef.current.kill();
    if (scrollTlRef.current) scrollTlRef.current.kill();
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, scrollTextRef.current]);

    gsap.set([headingRef.current, p1Ref.current, p2Ref.current], { autoAlpha: 0, y: 30 });
    gsap.set(scrollTextRef.current, { y: 0 });

    seqTlRef.current = gsap.timeline()
      .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .to(p1Ref.current,      { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.1')
      .to(p2Ref.current,      { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.5');

    // Scroll indicator: fade in + bounce (como ProjectsV2)
    gsap.delayedCall(3.0, () => {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
        onComplete: startScrollBounce,
      });
    });
  }, [startScrollBounce]);

  const resetAll = useCallback(() => {
    if (seqTlRef.current) { seqTlRef.current.kill(); seqTlRef.current = null; }
    if (scrollTlRef.current) { scrollTlRef.current.kill(); scrollTlRef.current = null; }
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, scrollTextRef.current, scrollIndicatorRef.current]);
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current], { autoAlpha: 0, y: 30 });
    gsap.set(scrollTextRef.current, { y: 0 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });
  }, []);

  // Desktop: section-entered event
  useEffect(() => {
    const handler = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id === 'about') playAll();
      else resetAll();
    };
    window.addEventListener('section-entered', handler as EventListener);
    return () => window.removeEventListener('section-entered', handler as EventListener);
  }, [playAll, resetAll]);

  // Mobile / fallback: IntersectionObserver
  useEffect(() => {
    const played = { value: false };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.value) {
          played.value = true;
          playAll();
        } else if (!entry.isIntersecting) {
          played.value = false;
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [playAll]);

  return (
    <section id="about" ref={sectionRef} className={styles.section}>
      <h1 ref={headingRef} className={styles.heading}>
        About me
      </h1>

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

      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span ref={scrollTextRef} style={{ display: 'inline-block' }}>
          {'Scroll'.split('').map((char, i) => (
            <span key={i} className={styles.scrollChar} style={{ display: 'inline-block' }}>
              {char}
            </span>
          ))}
        </span>
      </div>
    </section>
  );
}
