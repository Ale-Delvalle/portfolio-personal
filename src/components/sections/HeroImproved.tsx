import { useRef } from 'react';
import styles from './HeroImproved.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../../assets/foto-transparente.png';

gsap.registerPlugin(ScrollTrigger);

export function HeroImproved() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    });

    tl.fromTo(`.${styles.badge}`,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo(`.${styles.nameNumber}`,
      { autoAlpha: 0, x: -20 },
      { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo(`.${styles.nameMain}`,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(`.${styles.role}`,
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo(`.${styles.statCard}`,
      { autoAlpha: 0, y: 20, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' },
      '-=0.3'
    )
    .fromTo(`.${styles.photoFrame}`,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.5)' },
      '-=0.6'
    )
    .fromTo(`.${styles.textBlock}`,
      { autoAlpha: 0, x: 25 },
      { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(`.${styles.buttonGroup}`,
      { autoAlpha: 0, y: 15 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.3'
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.conceptLabel}>
        <span className={styles.conceptDot}></span>
        CONCEPTO — HOME MEJORADA
      </div>

      <div className={styles.watermark} aria-hidden="true">ALEXIS</div>
      <div className={styles.dotGrid} aria-hidden="true"></div>
      <div className={styles.glowOrb1} aria-hidden="true"></div>
      <div className={styles.glowOrb2} aria-hidden="true"></div>

      <div className={styles.content}>
        {/* Left column */}
        <div className={styles.leftCol}>
          <div className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Disponible · Buenos Aires, AR
          </div>

          <div className={styles.nameNumber}>01</div>
          <h1 className={styles.nameMain}>
            Alexis<br />Delvalle
          </h1>
          <p className={styles.role}>Full Stack Developer &amp; Backend Specialist</p>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>5</span>
              <span className={styles.statLabel}>Proyectos</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>2+</span>
              <span className={styles.statLabel}>Años exp.</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>8</span>
              <span className={styles.statLabel}>Tecnologías</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>Ver proyectos</button>
            <button className={styles.secondaryBtn}>Contáctame</button>
          </div>
        </div>

        {/* Center: Photo */}
        <div className={styles.centerCol}>
          <div className={styles.photoFrame}>
            <div className={styles.glowRing}></div>
            <div className={styles.glowRingInner}></div>
            <img src={profileImg} alt="Alexis Delvalle" className={styles.profileImg} />
          </div>
        </div>

        {/* Right: Text blocks */}
        <div className={styles.rightCol}>
          <div className={styles.textBlock}>
            <div className={styles.textBlockAccent}></div>
            <h3 className={styles.textBlockTitle}>Mi perfil profesional</h3>
            <p className={styles.textBlockBody}>
              Soy un full stack developer impulsado por la curiosidad y el aprendizaje.
              Aunque tengo un gusto especial por el backend, he trabajado en el front end,
              tanto en PC como en mobile.
            </p>
          </div>
          <div className={styles.textBlock}>
            <div className={styles.textBlockAccent}></div>
            <h3 className={styles.textBlockTitle}>Un poco de mí</h3>
            <p className={styles.textBlockBody}>
              Disfruto crear aplicaciones pero mucho más formar lazos humanos y profesionales.
              Buena comunicación y ambiente ameno en pro de crecer y conseguir objetivos.
            </p>
          </div>
          <div className={styles.dividerLine}></div>
        </div>
      </div>
    </section>
  );
}
