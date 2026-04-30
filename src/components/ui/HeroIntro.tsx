import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './HeroIntro.module.css';

interface HeroIntroProps {
  onFinish: () => void;
}

export default function HeroIntro({ onFinish }: HeroIntroProps) {
  const container = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: onFinish,
    });

    tl.from(textRefs.current, {
      y: -50,
      opacity: 0,
      stagger: 0.4,
      duration: 1,
      ease: "power3.out"
    })
    .to(textRefs.current, {
      opacity: 0,
      filter: "blur(12px)",
      scale: 1.05,
      stagger: 0.3,
      duration: 0.8,
      ease: "power2.inOut",
      delay: 0.5
    })
    .to(container.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out"
    });

  }, { scope: container });

  return (
    <div ref={container} className={styles.container}>
      <div className={styles.content}>
        <h1 ref={el => { textRefs.current[0] = el; }} className={styles.textLine}>Welcome to my portfolio</h1>
        <h1 ref={el => { textRefs.current[1] = el; }} className={styles.textLine}>Im a fullstack developer</h1>
        <h1 ref={el => { textRefs.current[2] = el; }} className={styles.textLine}>and backend specialist</h1>
      </div>
    </div>
  );
}