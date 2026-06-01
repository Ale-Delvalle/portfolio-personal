import styles from './Hero.module.css';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pleaseImg from '../../assets/please.png';
import profileImg from '../../assets/foto-transparente.png';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const nameWhiteRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const nameContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const contactBtnRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLSpanElement>(null);
  const welcomeContainerRef = useRef<HTMLDivElement>(null);
  
  // Canvas Sparks Refs
  const nameCanvasRef = useRef<HTMLCanvasElement>(null);
  const roleCanvasRef = useRef<HTMLCanvasElement>(null);
  const nameParticlesRef = useRef<any[]>([]);
  const roleParticlesRef = useRef<any[]>([]);

  // Parallax refs
  const xToBtn = useRef<any>(null);
  const yToBtn = useRef<any>(null);
  const rotXBtn = useRef<any>(null);
  const rotYBtn = useRef<any>(null);

  const [introDone, setIntroDone] = useState(false);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;
    const startY = isMobile ? (window.innerHeight * 0.1 + 100) : "20vh";
    const startScale = isMobile ? 1.15 : 1.5;
    const endY = isMobile ? 10 : 30;

    const wipeStart = isMobile ? "moveUp+=0.4" : "+=0.2";
    const wipeDuration = isMobile ? 0.6 : 0.9;

    const tl = gsap.timeline({ onComplete: () => setIntroDone(true) });

    gsap.set(nameContainerRef.current, { zIndex: 51, position: 'relative' });
    gsap.set(nameContainerRef.current, { zIndex: 51, position: 'relative' });
    gsap.set(welcomeContainerRef.current, { x: -50, autoAlpha: 0 });
    // 1) Nombre y Rol aparecen en el centro de la pantalla
    tl.fromTo(nameContainerRef.current, 
      { autoAlpha: 0, y: startY, scale: startScale },
      { autoAlpha: 1, y: startY, duration: 0.3, ease: "power3.out" }
    )
    // 1.5) Bolitas brillantes detrás del nombre de izquierda a derecha (Línea invisible, Renderizado en Canvas)
    const sweepProxy = { val: 0 };
    tl.addLabel("introSparks", "+=0.05")
    .to(sweepProxy, {
      val: 1,
      duration: 0.3,
      ease: "power2.inOut",
      onUpdate: () => {
        const nCanvas = nameCanvasRef.current;
        const rCanvas = roleCanvasRef.current;
        if (!nCanvas || !rCanvas) return;
        
        const yBaseN = nCanvas.height * 0.8;
        const yBaseR = rCanvas.height * 0.8;
        const xPosN = sweepProxy.val * nCanvas.width;
        const xPosR = sweepProxy.val * rCanvas.width;
        
        const emit = (particlesArr: any[], x: number, y: number) => {
          const count = Math.floor(Math.random() * 3) + 1; 
          for (let i = 0; i < count; i++) {
            particlesArr.push({
              x: x + (Math.random() - 0.5) * 15, 
              y: y + (Math.random() - 0.5) * 15,
              vx: (Math.random() - 0.5) * 0.8,
              vy: (Math.random() * -1) - 0.2, 
              life: 1.0 + Math.random() * 0.5,
              size: Math.random() * 2.5 + 0.5 
            });
          }
        };

        emit(nameParticlesRef.current, xPosN, yBaseN);
        emit(roleParticlesRef.current, xPosR, yBaseR);
      }
    }, "introSparks")
    .set([nameCanvasRef.current, roleCanvasRef.current], { display: "none" }, "introSparks+=1")
    // 2) Se desplazan hacia su posición final (arriba)
    .addLabel("moveUp", "+=0.1")
    .to(nameContainerRef.current, {
      y: endY,
      scale: 1,
      duration: 1.2,
      ease: "power3.inOut",
      onStart: () => {
        window.dispatchEvent(new CustomEvent('hero-move-up'));
      }
    }, "moveUp");

    if (isMobile) {
      // --- SECUENCIA PREMIUM AAA EXCLUSIVA MÓVIL ---
      // 3) Imagen de perfil aparece con desplazamiento suave (Fade + Slide)
      tl.fromTo(imageRef.current, 
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4" // Se solapa sutilmente con el final de la subida
      )
      // 4) Bloques de texto de la derecha aparecen secuencialmente uno a uno
      .from(rightTextRef.current ? rightTextRef.current.children : [], {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.25, // retraso elegante entre el primer y segundo bloque
        ease: "power3.out"
      }, ">-=0.2")
      // 5) Grupo de botones aparece en bloque
      .from(buttonsRef.current, {
        autoAlpha: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out"
      }, ">-=0.1")
      // 5.5) Bienvenido a mi portfolio reemplaza el role
      .to(roleRef.current, {
        x: 50,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in"
      }, "moveUp+=2")
      .to(welcomeContainerRef.current, {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
      }, ">")
      // 6) Indicador de Scroll
      .fromTo(scrollIndicatorRef.current,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
        ">-=0.2"
      );
    } else {
      // --- SECUENCIA ORIGINAL PARA PC Y TABLET ---
      // 3) Imagen aparece con desplazamiento suave (Fade + Slide)
      tl.fromTo(imageRef.current, 
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
      // 4.5) Bienvenido a mi portfolio reemplaza el role de izquierda a derecha
      .to(roleRef.current, {
        x: 50,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in"
      }, "moveUp+=2")
      .to(welcomeContainerRef.current, {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out"
      }, ">")
      // 5) Indicador de Scroll
      .fromTo(scrollIndicatorRef.current,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );
    }
    // 6) Barrido del nombre: de degradado brillante a blanco, de derecha a izquierda
    tl.addLabel("nameWipe", wipeStart)
    .fromTo(nameWhiteRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', textShadow: 'none', duration: wipeDuration, ease: 'power2.inOut' },
      "nameWipe"
    )
    .call(() => {
      if (document.documentElement.getAttribute('data-theme') === 'dark' && nameRef.current) {
        gsap.to(nameRef.current, {
          filter: 'drop-shadow(0 4px 20px rgba(255, 107, 0, 0))',
          duration: 0.4,
          ease: 'power2.inOut',
        });
      }
    }, [], "nameWipe+=" + (wipeDuration * 0.6));

    // --- MOUSE PARALLAX (Botón Contactame) ---
    xToBtn.current = gsap.quickTo(contactBtnRef.current, "x", { duration: 0.8, ease: "power3" });
    yToBtn.current = gsap.quickTo(contactBtnRef.current, "y", { duration: 0.8, ease: "power3" });
    rotXBtn.current = gsap.quickTo(contactBtnRef.current, "rotationX", { duration: 0.8, ease: "power3" });
    rotYBtn.current = gsap.quickTo(contactBtnRef.current, "rotationY", { duration: 0.8, ease: "power3" });

    // --- ANIMACION INFINITA SCROLL TEXT ---
    const scrollTl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 1, repeatRefresh: true });
    
    // 1) Primero: 5 saltos principales
    scrollTl.to(scrollTextRef.current, {
      y: -12,
      duration: 0.3,
      yoyo: true,
      repeat: 9, // 5 saltos completos
      ease: "power2.out"
    })
    // 6to salto: pierde fuerza
    .to(scrollTextRef.current, {
      y: -6,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    })
    // 7mo salto: casi imperceptible
    .to(scrollTextRef.current, {
      y: -2,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
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

  useEffect(() => {
    const nCanvas = nameCanvasRef.current;
    const rCanvas = roleCanvasRef.current;
    if (!nCanvas || !rCanvas) return;
    
    const nCtx = nCanvas.getContext('2d');
    const rCtx = rCanvas.getContext('2d');
    if (!nCtx || !rCtx) return;

    const resize = () => {
      nCanvas.width = nCanvas.offsetWidth;
      nCanvas.height = nCanvas.offsetHeight;
      rCanvas.width = rCanvas.offsetWidth;
      rCanvas.height = rCanvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId: number;

    const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, particles: any[]) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'screen';
      
      for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008; 
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        
        const alpha = Math.min(1, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        if (p.size > 2) {
          ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 107, 0, ${alpha})`;
        }
        ctx.fill();
        
        if (p.life > 0.5 && p.size > 1.5) {
          ctx.shadowColor = `rgba(255, 167, 38, ${alpha})`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const animate = () => {
      drawParticles(nCtx, nCanvas, nameParticlesRef.current);
      drawParticles(rCtx, rCanvas, roleParticlesRef.current);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main id="home" ref={mainRef} className={`${styles.main} hero-mesh-gradient`} onMouseMove={handleMouseMove} style={{ perspective: "1000px" }}>
      <div className={styles.content}>
        
        <div ref={nameContainerRef} className={styles.nameContainer}>
          <div ref={nameRef} className={styles.name}>
            <div className={styles.introSparksContainer}>
              <canvas ref={nameCanvasRef} className={styles.introSparksCanvas} />
            </div>
            Alexis Delvalle
            <span ref={nameWhiteRef} className={styles.nameWhiteOverlay} aria-hidden="true">
              Alexis Delvalle
            </span>
          </div>
          <div className={styles.roleContainer}>
            <div className={styles.introSparksContainer}>
              <canvas ref={roleCanvasRef} className={styles.introSparksCanvas} />
            </div>
            <div ref={roleRef} className={styles.role}>Fullstack developer and backend specialist</div>
            <div ref={welcomeContainerRef} className={styles.welcomeText}>Bienvenido a mi portfolio</div>
          </div>
        </div>

        <div className={styles.textsContainer}>
          <div className={styles.leftColumn}>
            <div ref={imageRef} className={styles.imageWrapper}>
              <img src={profileImg} alt="Alexis Delvalle" className={styles.profileImage} />
            </div>
            <div ref={buttonsRef} className={styles.buttonGroup}>
              <button className={styles.primaryBtn}>Revisar proyectos</button>
              <a href="/cv-alexis-delvalle.pdf" download className={styles.primaryBtn}>Descargar CV</a>
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
            <span key={i} className={styles.scrollChar} style={{ display: "inline-block" }}>
              {char}
            </span>
          ))}
        </span>
      </div>
    </main>
  );
}
