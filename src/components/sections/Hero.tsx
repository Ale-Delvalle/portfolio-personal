
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
  const textRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: introDone ? 0 : 2.5 });

    tl.from('[data-gsap="title"]', {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power3.out",
    })
    .from(
      ['[data-gsap="description"]', '[data-gsap="action"]'],
      {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power3.out",
      },
      "-=0.1"
    )
    .from(
      portraitRef.current,
      {
        opacity: 0,
        y: -80,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.2"
    );
  }, []);

  return (
    <main className={`${styles.main} hero-mesh-gradient`}>
      <div className={styles.grid}>
        <div ref={textRef} className={styles.col2}>
          <HeroText />
        </div>
        <div ref={portraitRef} className={styles.col3}>
          <HeroPortrait />
        </div>
      </div>
      <div className={styles.meshBottom}></div>
    </main>
  );
}
