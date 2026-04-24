
import { HeroText } from './HeroText';
import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface HeroProps {
  introDone: boolean;
}

export function Hero({ introDone }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (introDone) {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        delay: 0.5 // 👈 clave para sincronizar con la intro
      });
    }
  }, { dependencies: [introDone] });

  return (
    <main ref={heroRef} className={`${styles.main} hero-mesh-gradient`}>
      <div className={styles.grid}>
        <div className={styles.col2}>
          <HeroText />
        </div>
        <div className={styles.col3}>
          <HeroPortrait />
        </div>
      </div>
      <div className={styles.meshBottom}></div>
    </main>
  );
}
