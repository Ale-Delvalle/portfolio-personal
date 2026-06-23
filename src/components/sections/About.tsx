import { useRef, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './About.module.css';

export function About() {
  const sectionRef         = useRef<HTMLElement>(null);
  const headingRef         = useRef<HTMLHeadingElement>(null);
  const p1Ref              = useRef<HTMLParagraphElement>(null);
  const p2Ref              = useRef<HTMLParagraphElement>(null);
  const p3Ref              = useRef<HTMLParagraphElement>(null);
  const p4Ref              = useRef<HTMLParagraphElement>(null);
  const p5Ref              = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef      = useRef<HTMLSpanElement>(null);
  const scrollTlRef        = useRef<gsap.core.Timeline | null>(null);
  const seqTlRef           = useRef<gsap.core.Timeline | null>(null);

  // Initial hidden state
  useGSAP(() => {
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { autoAlpha: 0, y: 30 });
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
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, scrollTextRef.current]);

    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { autoAlpha: 0, y: 30 });
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
      .to(p5Ref.current,      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.5);
  }, [startScrollBounce]);

  const resetAll = useCallback(() => {
    if (seqTlRef.current) { seqTlRef.current.kill(); seqTlRef.current = null; }
    if (scrollTlRef.current) { scrollTlRef.current.kill(); scrollTlRef.current = null; }
    gsap.killTweensOf([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current, scrollTextRef.current, scrollIndicatorRef.current]);
    gsap.set([headingRef.current, p1Ref.current, p2Ref.current, p3Ref.current, p4Ref.current, p5Ref.current], { autoAlpha: 0, y: 30 });
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
        Acerca de mi
      </h1>

      <div className={styles.paragraphsWrapper}>
        <p ref={p1Ref} className={styles.paragraph}>
          Soy Full Stack Developer con orientación al backend, formado en Soy Henry y con una primer experiencia laboral real trabajando en remoto para Fresh & Dash, empresa con sede en Suiza, como Mobile Developer en su aplicación Vitality+.
        </p>
        <p ref={p2Ref} className={styles.paragraph}>
          Antes de dedicarme a la programación de forma profesional, cursé la Licenciatura en Sistemas en la UNNE — lo que me dio una base sólida en fundamentos de programación, algoritmos y pensamiento lógico que hoy aplico en cada proyecto.
        </p>
        <p ref={p3Ref} className={styles.paragraph}>
          Me especializo en backend porque es donde más disfruto: diseñar el modelo de datos, estudiar las entidades y sus relaciones, y definir la lógica de negocio antes de escribir código.
        </p>
        <p ref={p4Ref} className={styles.paragraph}>
          Creo que el buen software se construye con criterio técnico y buenas prácticas — no como un fin en sí mismo, sino porque un código mantenible y escalable es lo que le da valor real al producto. Es el estándar con el que trabajo y el que busco en el equipo donde me desempeñe.
        </p>
        <p ref={p5Ref} className={styles.paragraph}>
          Vivimos una transición tecnológica real. Hay quienes creen que la IA reemplazará a los trabajadores — yo creo lo contrario: nos hace más productivos y libera tiempo para lo que realmente importa. El criterio para analizar, la capacidad de tomar decisiones y la calidez humana que potencia a los equipos de trabajo no se automatizan. Éste es mi concepto de Human First: el valor de las personas es incuestionable.
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
