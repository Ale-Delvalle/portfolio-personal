import styles from './Hero.module.css';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pleaseImg from '../../assets/please.png';
import profileImg from '../../assets/foto-transparente.png';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);

  // Parallax refs
  const xToBtn = useRef<any>(null);
  const yToBtn = useRef<any>(null);
  const rotXBtn = useRef<any>(null);
  const rotYBtn = useRef<any>(null);

  const [introDone, setIntroDone] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: () => setIntroDone(true) });

    // 1) Nombre y Rol aparecen en el centro de la pantalla a escala 1.5
    tl.fromTo(nameContainerRef.current, 
      { autoAlpha: 0, y: "20vh", scale: 1.5 },
      { autoAlpha: 1, y: "20vh", duration: 1, ease: "power3.out" }
    )
    // 2) Se desplazan hacia su posición final (arriba)
    .to(nameContainerRef.current, {
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      delay: 0.3
    })
    // 3) Imagen aparece con desplazamiento suave (Fade + Slide)
    .fromTo(imageRef.current, 
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.5"
    )
    // 4) Textos y botones
    .from([rightTextRef.current, buttonsRef.current], {
      autoAlpha: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=1")
    // 5) Indicador de Scroll
    .fromTo(scrollIndicatorRef.current,
      { autoAlpha: 0, y: -10 },
      { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // --- MOUSE PARALLAX (Botón Contactame) ---
    xToBtn.current = gsap.quickTo(contactBtnRef.current, "x", { duration: 0.8, ease: "power3" });
    yToBtn.current = gsap.quickTo(contactBtnRef.current, "y", { duration: 0.8, ease: "power3" });
    rotXBtn.current = gsap.quickTo(contactBtnRef.current, "rotationX", { duration: 0.8, ease: "power3" });
    rotYBtn.current = gsap.quickTo(contactBtnRef.current, "rotationY", { duration: 0.8, ease: "power3" });

    // --- SCROLL PARALLAX (Solo nombre/rol) ---
    gsap.to(nameContainerRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: mainRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // --- ANIMACION INFINITA SCROLL TEXT (Saltos realistas + Pausa 5s) ---
    const scrollTl = gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 3 });
    
    // 5 saltos principales
    scrollTl.to(scrollTextRef.current, {
      y: -12,
      duration: 0.3,
      yoyo: true,
      repeat: 9, // 5 saltos completos
      ease: "power2.out"
    })
    // 6to salto: pierde fuerza (llega a la mitad)
    .to(scrollTextRef.current, {
      y: -6,
      duration: 0.25,
      yoyo: true,
      repeat: 1, // 1 salto completo (sube y baja)
      ease: "power2.out"
    })
    // 7mo salto: casi imperceptible, se detiene
    .to(scrollTextRef.current, {
      y: -2,
      duration: 0.15,
      yoyo: true,
      repeat: 1, // 1 salto completo
      ease: "power2.out"
    });

    // --- FADE OUT INDICADOR SCROLL (Efecto Polvo / Thanos Snap de derecha a izquierda) ---
    gsap.to(`.${styles.scrollChar}`, {
      opacity: 0,
      x: () => (Math.random() - 0.5) * 100, // se esparce horizontalmente
      y: () => -20 - Math.random() * 80, // vuela hacia arriba
      rotation: () => (Math.random() - 0.5) * 120, // gira al azar
      scale: 0, // se hace polvo
      filter: "blur(8px)", // efecto granulado
      stagger: {
        amount: 0.6, // duración de la cascada
        from: "end" // empieza por la derecha (última letra)
      },
      scrollTrigger: {
        trigger: mainRef.current,
        start: "75% top", // da un poco más de tiempo para apreciar el efecto
        end: "100% top",
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
      const maxLeftTravel = -10;
      const targetX = Math.max(maxLeftTravel, nX * 25);
      
      xToBtn.current(targetX);
      yToBtn.current(nY * 25);
      rotXBtn.current(nY * -25);
      rotYBtn.current(nX * 25);
    }
  };

  return (
    <main ref={mainRef} className={`${styles.main} hero-mesh-gradient`} onMouseMove={handleMouseMove} style={{ perspective: "1000px" }}>
      <div className={styles.content}>
        
        <div ref={nameContainerRef} className={styles.nameContainer}>
          <div ref={nameRef} className={styles.name}>Alexis Delvalle</div>
          <div ref={roleRef} className={styles.role}>Fullstack developer and backend specialist</div>
        </div>

        <div className={styles.textsContainer}>
          <div className={styles.leftColumn}>
            <div ref={imageRef} className={styles.imageWrapper}>
              <img src={profileImg} alt="Alexis Delvalle" className={styles.profileImage} />
            </div>
            <div ref={buttonsRef} className={styles.buttonGroup}>
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

          <div ref={rightTextRef} className={styles.rightColumn}>
            <div className={styles.textBlock}>
              <h2 className={styles.sideTitle}>Mi perfil profesional</h2>
              <p className={styles.sideDesc}>
                Soy un full stack developer impulsado por la curiosidad y al aprendizaje. Aunque tengo un gusto especial por el backend he trabajado en el front end, tanto en PC y mobile.
              </p>
            </div>
            <div className={styles.textBlock}>
              <h2 className={styles.sideTitle}>Un poco de mi</h2>
              <p className={styles.sideDesc}>
                Disfruto crear aplicaciones pero mucho más formar lazos humanos y profesionales, una buena comunicacion y un ambiente laboral ameno en pro de crecer y conseguir nuestros objetivos.
              </p>
            </div>
          </div>
        </div>

      </div>
      <div className={styles.meshBottom}></div>
      
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <span ref={scrollTextRef} style={{ display: "inline-block" }}>
          {"Scroll".split("").map((char, i) => (
            <span key={i} className={styles.scrollChar} style={{ display: "inline-block", willChange: "transform, opacity, filter" }}>
              {char}
            </span>
          ))}
        </span>
      </div>
    </main>
  );
}
