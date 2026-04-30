import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1) Nombre y Rol aparecen en el centro a escala 2x
    // Suavizamos la entrada
    tl.fromTo(nameContainerRef.current, 
      { autoAlpha: 0, y: -180, scale: 1.3 },
      { autoAlpha: 1, duration: 1, ease: "power3.out" }
    )
    // 2) Disminuyen de tamaño y bajan a su posición actual
    .to(nameContainerRef.current, {
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      delay: 0.3
    })
    // 3) Aparece la foto
    .from(portraitRef.current, {
      autoAlpha: 0,
      y: -30,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.4")
    // 4) Textos izquierdo y derecho
    .from([leftTextRef.current, rightTextRef.current], {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      stagger: 0,
      ease: "power3.out",
    }, "-=0.4");

  }, []);

  return (
    <main className={`${styles.main} hero-mesh-gradient`}>
      <div className={styles.content}>
        
        <div ref={leftTextRef} className={styles.leftSide}>
          <h2 className={styles.sideTitleLarge}>Mi perfil profesional</h2>
          <p className={styles.sideDesc}>
            Soy un full stack developer impulsado por la curiosidad y al aprendizaje. Aunque tengo un gusto especial por el backend he trabajado en el front end, tanto en PC y mobile.
          </p>
          <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>Revisar proyectos</button>
            <button className={styles.secondaryBtn}>Contáctame</button>
          </div>
        </div>

        <div className={styles.centerCol}>
          <div className={styles.portraitAnchor}>
            <div ref={portraitRef} className={styles.portraitWrapper}>
              <HeroPortrait />
            </div>
            <div ref={nameContainerRef} className={styles.nameContainer}>
              <div ref={nameRef} className={styles.name}>Alexis Delvalle</div>
              <div ref={roleRef} className={styles.role}>Fullstack and backend specialist</div>
            </div>
          </div>
        </div>

        <div ref={rightTextRef} className={styles.rightSide}>
          <h2 className={styles.sideTitle}>Un poco de mi</h2>
          <p className={styles.sideDesc}>
            Disfruto crear aplicaciones pero mucho más formar lazos humanos y profesionales, una buena comunicacion y un ambiente laboral ameno en pro de crecer y conseguir nuestros objetivos.
          </p>
        </div>
      </div>
      <div className={styles.meshBottom}></div>
    </main>
  );
}
