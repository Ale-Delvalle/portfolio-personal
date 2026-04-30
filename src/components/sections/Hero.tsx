
import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface HeroProps {
  introDone: boolean;
}

export function Hero({ introDone }: HeroProps) {
  const nameRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // La nueva intro tarda aprox 3.7s antes de empezar a desaparecer
    const tl = gsap.timeline({ delay: introDone ? 0 : 3.7 });

    tl.from(
      portraitRef.current,
      {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.7,
        ease: "power3.out",
      }
    )
    .from(nameRef.current, {
      autoAlpha: 0,
      x: -20,
      duration: 0.5,
      ease: "power3.out",
    }, "-=0.3");
  }, []);

  return (
    <main className={`${styles.main} hero-mesh-gradient`}>
      <div className={styles.content}>
        <div ref={nameRef} className={styles.nameTopLeft}>
          Alexis Delvalle
        </div>

        <div ref={portraitRef} className={styles.portraitWrapper}>
          <HeroPortrait />
        </div>
      </div>
      <div className={styles.meshBottom}></div>
    </main>
  );
}
