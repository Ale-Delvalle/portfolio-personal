
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
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      delay: introDone ? 0 : 2.5,
      ease: "power3.out"
    });
  }, []);

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
