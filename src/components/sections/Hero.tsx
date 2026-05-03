import { HeroPortrait } from './HeroPortrait';
import styles from './Hero.module.css';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pleaseImg from '../../assets/please.png';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);

  // Welcome Intro Refs
  // const welcomeContainerRef = useRef<HTMLDivElement>(null);
  // const welcomeTopRef = useRef<HTMLDivElement>(null);
  // const welcomeBottomRef = useRef<HTMLDivElement>(null);
  
  // Parallax refs
  const xToBtn = useRef<any>(null);
  const yToBtn = useRef<any>(null);
  const rotXBtn = useRef<any>(null);
  const rotYBtn = useRef<any>(null);

  const [introDone, setIntroDone] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    // --- SECUENCIA DE INTRODUCCIÓN ---
    // (Animación Welcome comentada para posible uso futuro)
    /*
    gsap.set(nameContainerRef.current, { autoAlpha: 0, y: -180, scale: 1.3 });
    gsap.set(welcomeContainerRef.current, { autoAlpha: 0 });

    // 0s: Aparece Nombre (escalado) y Welcome text
    tl.to([nameContainerRef.current, welcomeContainerRef.current], {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 0)
    // 0s a 1s: Welcome text se triplica
    .to(welcomeTopRef.current, { x: 35, y: -15, duration: 1, ease: "power3.out" }, 0)
    .to(welcomeBottomRef.current, { x: -35, y: 15, duration: 1, ease: "power3.out" }, 0)
    
    // 1s a 2s: Welcome text se une
    .to([welcomeTopRef.current, welcomeBottomRef.current], {
      x: 0, y: 0, duration: 1, ease: "power3.inOut"
    }, 1)

    // 2s: Welcome desaparece y el nombre baja
    .to(welcomeContainerRef.current, {
      autoAlpha: 0,
      y: -20,
      duration: 0.5,
      ease: "power2.out"
    }, 2)
    .to(nameContainerRef.current, {
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut"
    }, 2)
    */

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

    // --- MOUSE PARALLAX (Botón Contactame) ---
    // Movimiento posicional
    xToBtn.current = gsap.quickTo(contactBtnRef.current, "x", { duration: 0.8, ease: "power3" });
    yToBtn.current = gsap.quickTo(contactBtnRef.current, "y", { duration: 0.8, ease: "power3" });
    
    // Movimiento rotacional (Tilt 3D)
    rotXBtn.current = gsap.quickTo(contactBtnRef.current, "rotationX", { duration: 0.8, ease: "power3" });
    rotYBtn.current = gsap.quickTo(contactBtnRef.current, "rotationY", { duration: 0.8, ease: "power3" });

    // --- SCROLL PARALLAX (Solo nombre/rol) ---

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

    if (xToBtn.current) {
      // Movimiento posicional con límite izquierdo para no chocar con el otro botón
      // El gap estático es 40px (2.5rem). Permitimos acercarse un máximo de 10px (quedando a 30px de distancia)
      const maxLeftTravel = -10;
      const targetX = Math.max(maxLeftTravel, nX * 25);
      
      xToBtn.current(targetX);
      yToBtn.current(nY * 25);

      // Efecto Tilt 3D (Observando al cursor)
      // Si el mouse va a la derecha (nX > 0), el lado derecho debe ir hacia atrás (rotY positivo)
      rotXBtn.current(nY * -25);
      rotYBtn.current(nX * 25);
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
            <div ref={contactBtnRef} className={styles.btn3dContainer}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.btnLayer} style={{ transform: `translateZ(${-i * 2}px)` }}></div>
              ))}
              <button className={styles.secondaryBtn}>
                Contáctame 
                <span className={styles.emojiWrapper}>
                  <span className={styles.emojis}>👁️👁️</span>
                  <img src={pleaseImg} alt="Please" className={styles.pleaseImg} />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.centerCol}>
          <div className={styles.portraitAnchor}>
            <div ref={portraitRef} className={styles.portraitWrapper}>
              <HeroPortrait />
            </div>
            <div ref={nameContainerRef} className={styles.nameContainer}>
              {/* Animación "Welcome to my portfolio" guardada para uso futuro */}
              {/*
              <div ref={welcomeContainerRef} className={styles.welcomeContainer}>
                <div ref={welcomeTopRef} className={`${styles.welcomeText} ${styles.welcomeTop}`}>Welcome to my portfolio</div>
                <div className={`${styles.welcomeText} ${styles.welcomeCenter}`}>Welcome to my portfolio</div>
                <div ref={welcomeBottomRef} className={`${styles.welcomeText} ${styles.welcomeBottom}`}>Welcome to my portfolio</div>
              </div>
              */}
              <div ref={nameRef} className={styles.name}>Alexis Delvalle</div>
              <div ref={roleRef} className={styles.role}>Fullstack developer and backend specialist</div>
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
