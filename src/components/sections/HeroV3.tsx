import { useRef } from 'react';
import styles from './HeroV3.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileImg from '../../assets/foto-transparente.png';

gsap.registerPlugin(ScrollTrigger);

export function HeroV3() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    });

    tl.fromTo(`.${styles.photoFrame}`,
      { autoAlpha: 0, x: -50 },
      { autoAlpha: 1, x: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo(`.${styles.badge}`,
      { autoAlpha: 0, y: -14 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo(`.${styles.nameFirst}`,
      { autoAlpha: 0, x: 50 },
      { autoAlpha: 1, x: 0, duration: 0.75, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(`.${styles.nameLast}`,
      { autoAlpha: 0, x: 50 },
      { autoAlpha: 1, x: 0, duration: 0.75, ease: 'power3.out' },
      '-=0.55'
    )
    .fromTo(`.${styles.role}`,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(`.${styles.cardProfile}`,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo(`.${styles.cardAbout}`,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' },
      '-=0.5'
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.conceptLabel}>
        <span className={styles.conceptDot}></span>
        CONCEPTO — HOME V3
      </div>

      <div className={styles.watermark} aria-hidden="true">ALEXIS</div>
      <div className={styles.dotGrid} aria-hidden="true"></div>
      <div className={styles.glowOrb1} aria-hidden="true"></div>
      <div className={styles.glowOrb2} aria-hidden="true"></div>

      <div className={styles.content}>

        {/* LEFT: Foto + card perfil */}
        <div className={styles.leftCol}>
          <div className={styles.photoFrame}>
            <div className={styles.photoGlow}></div>
            <img src={profileImg} alt="Alexis Delvalle" className={styles.profileImg} />
          </div>

          <div className={styles.cardProfile}>
            <div className={styles.cardAccent}></div>
            <h3 className={styles.cardTitle}>Mi perfil profesional</h3>
            <p className={styles.cardBody}>
              Soy un full stack developer impulsado por la curiosidad y el aprendizaje.
              Aunque tengo un gusto especial por el backend, he trabajado en el front end,
              tanto en PC como en mobile.
            </p>
          </div>
        </div>

        {/* RIGHT: Nombre + rol + card "Un poco de mí" */}
        <div className={styles.rightCol}>
          <div className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Disponible · Buenos Aires, AR
          </div>

          <div className={styles.nameBlock}>
            <span className={styles.nameFirst}>Alexis</span>
            <span className={styles.nameLast}>Delvalle</span>
            <p className={styles.role}>Full Stack Developer &amp; Backend Specialist</p>
          </div>

          <div className={styles.cardAbout}>
            <div className={styles.cardAccent}></div>
            <h3 className={styles.cardTitle}>Un poco de mí</h3>
            <p className={styles.cardBody}>
              Disfruto crear aplicaciones pero mucho más formar lazos humanos y profesionales.
              Buena comunicación y ambiente ameno en pro de crecer y conseguir objetivos juntos.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
