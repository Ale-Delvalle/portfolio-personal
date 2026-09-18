import { useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './About.module.css';
import { useLanguage } from '../../context/LanguageContext';

export function About() {
  const { t } = useLanguage();
  const sectionRef         = useRef<HTMLElement>(null);
  const headingRef         = useRef<HTMLHeadingElement>(null);
  const p1Ref              = useRef<HTMLParagraphElement>(null);
  const p2Ref              = useRef<HTMLParagraphElement>(null);
  const p3Ref              = useRef<HTMLParagraphElement>(null);
  const p4Ref              = useRef<HTMLParagraphElement>(null);
  const p5Ref              = useRef<HTMLParagraphElement>(null);
  const p6Ref              = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef      = useRef<HTMLSpanElement>(null);
  const scrollTlRef        = useRef<gsap.core.Timeline | null>(null);
  const seqTlRef           = useRef<gsap.core.Timeline | null>(null);

  // Initial hidden state
  useGSAP(() => {
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, p6Ref.current], { autoAlpha: 0, y: 30 });
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
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, p6Ref.current, scrollTextRef.current]);

    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, p6Ref.current], { autoAlpha: 0, y: 30 });
    gsap.set(scrollTextRef.current, { y: 0 });

    seqTlRef.current = gsap.timeline({
      onComplete: () => {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 1, duration: 0.8, ease: 'power2.out',
          onComplete: startScrollBounce,
        });
      }
    })
      .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0)
      .to(p1Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1)
      .to(p2Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.2)
      .to(p3Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.3)
      .to(p4Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.4)
      .to(p5Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.5)
      .to(p6Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.6);
  }, [startScrollBounce]);

  const resetAll = useCallback(() => {
    if (seqTlRef.current) { seqTlRef.current.kill(); seqTlRef.current = null; }
    if (scrollTlRef.current) { scrollTlRef.current.kill(); scrollTlRef.current = null; }
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, p6Ref.current, scrollTextRef.current, scrollIndicatorRef.current]);
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, p6Ref.current], { autoAlpha: 0, y: 30 });
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

  // Desktop fallback: anima todo cuando la sección entra al viewport
  useEffect(() => {
    if (window.innerWidth < 1024) return;
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

  // Mobile: cada elemento se revela individualmente al entrar al viewport
  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    const elements = [
      headingRef.current,
      p1Ref.current,
      p2Ref.current,
      p3Ref.current,
      p4Ref.current,
      p5Ref.current,
      p6Ref.current,
    ].filter(Boolean) as HTMLElement[];

    const observers = elements.map((el) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
            obs.disconnect();
          }
        },
        { threshold: 1.0, rootMargin: '0px 0px -10px 0px' }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.section} data-section-trigger>
      <h1 ref={headingRef} className={styles.heading}>
        {t.about.heading}
      </h1>

      <div className={styles.paragraphsWrapper}>
        <p ref={p1Ref} className={styles.paragraph}>
          {t.about.paragraphs[0]}
        </p>
        <p ref={p2Ref} className={styles.paragraph}>
          {t.about.paragraphs[1]}
        </p>
        <p ref={p3Ref} className={styles.paragraph}>
          {t.about.paragraphs[2]}
        </p>
        <p ref={p4Ref} className={styles.paragraph}>
          {t.about.paragraphs[3]}
        </p>
        <p ref={p5Ref} className={styles.paragraph}>
          {t.about.paragraphs[4]}
        </p>
        <p ref={p6Ref} className={styles.paragraph}>
          {t.about.paragraphs[5]}
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
