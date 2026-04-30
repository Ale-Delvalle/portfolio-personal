import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  // Parallax refs
  const xToPortrait = useRef<any>(null);
  const yToPortrait = useRef<any>(null);

  const xToName = useRef<any>(null);
  const yToName = useRef<any>(null);
  const rotXName = useRef<any>(null);
  const rotYName = useRef<any>(null);

  const [introDone, setIntroDone] = useState(false);

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
      onComplete: () => setIntroDone(true)
    }, "-=0.4");

    // --- MOUSE PARALLAX (Solo foto y nombre/rol) ---
    // Movimiento posicional
    xToPortrait.current = gsap.quickTo(portraitRef.current, "x", { duration: 0.8, ease: "power3" });
    yToPortrait.current = gsap.quickTo(portraitRef.current, "y", { duration: 0.8, ease: "power3" });
    xToName.current = gsap.quickTo(nameContainerRef.current, "x", { duration: 0.8, ease: "power3" });
    yToName.current = gsap.quickTo(nameContainerRef.current, "y", { duration: 0.8, ease: "power3" });

    // Movimiento rotacional (Tilt 3D solo para el nombre)
    rotXName.current = gsap.quickTo(nameContainerRef.current, "rotationX", { duration: 0.8, ease: "power3" });
    rotYName.current = gsap.quickTo(nameContainerRef.current, "rotationY", { duration: 0.8, ease: "power3" });

    // --- SCROLL PARALLAX (Solo foto y nombre/rol) ---
    gsap.to(portraitRef.current, {
      yPercent: 15,
      ease: "none",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to(nameContainerRef.current, {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: mainRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!introDone || window.innerWidth < 1024) return;

    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const nX = (clientX - centerX) / centerX;
    const nY = (clientY - centerY) / centerY;

    if (xToPortrait.current) {
      // Foto se mueve sutilmente opuesto (solo movimiento posicional 2D)
      xToPortrait.current(nX * -10);
      yToPortrait.current(nY * -10);
      
      // Nombre y rol siguen ligeramente al cursor
      xToName.current(nX * 15);
      yToName.current(nY * 15);

      // Efecto Tilt 3D (Solo para el nombre)
      rotXName.current(nY * -15);
      rotYName.current(nX * 15);
    }
  };

  return (
    <main ref={mainRef} className={`${styles.main} hero-mesh-gradient`} onMouseMove={handleMouseMove} style={{ perspective: "1000px" }}>
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
              <div className={styles.name3dWrapper}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className={styles.nameLayer} style={{ transform: `translateZ(${-i * 2}px)` }}>
                    Alexis Delvalle
                  </div>
                ))}
                <div ref={nameRef} className={styles.name}>Alexis Delvalle</div>
              </div>
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
