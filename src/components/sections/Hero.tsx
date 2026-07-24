import styles from './Hero.module.css';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pleaseImg from '../../assets/please.png';
import profileImg from '../../assets/foto.png';
import cvFile from '../../assets/Delvalle-Alexis-CV-full-stack-developer.docx?url';

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
  const mobileAccentRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const howIWorkRef = useRef<HTMLDivElement>(null);

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

  // Cinematic profile image refs
  const glowRef = useRef<HTMLDivElement>(null);
  const profileImageRef = useRef<HTMLImageElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [introDone, setIntroDone] = useState(false);

  useGSAP(() => {
    const isMobile = window.innerWidth < 768;
    const startY = isMobile ? (window.innerHeight / 2 - 80) : (window.innerHeight * 0.2 + 50);
    const startScale = isMobile ? 1.15 : 1.5;
    const endY = isMobile ? 10 : 30;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroDone(true);
        if (introOverlayRef.current) {
          introOverlayRef.current.style.display = 'none';
        }
        if (isMobile) {
          if (imageRef.current) gsap.set(imageRef.current, { clearProps: "all" });
          if (buttonsRef.current) gsap.set(Array.from(buttonsRef.current.children), { clearProps: "all" });
          if (rightTextRef.current) gsap.set(rightTextRef.current, { clearProps: "all" });
        }
      }
    });

    gsap.set(nameContainerRef.current, { zIndex: 51, position: 'relative' });

    if (isMobile) {
      gsap.set(imageRef.current, { opacity: 0, scale: 0.92, y: -80 });
      gsap.set(rightTextRef.current, { autoAlpha: 0 });
      gsap.set(mobileAccentRef.current, { scaleX: 0, opacity: 0 });
      // "¿Cómo trabajo?" no está visible sin scroll en mobile: se revela por ScrollTrigger, no en la intro
      gsap.set(howIWorkRef.current, { autoAlpha: 0, y: 30 });
      if (buttonsRef.current) {
        gsap.set(Array.from(buttonsRef.current.children), { opacity: 0, y: 18, scale: 0.95 });
      }
    }
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
      // --- SECUENCIA MOBILE ---
      // Overlay naranja-marrón se desvanece cuando el nombre sube
      tl.to(introOverlayRef.current, {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "moveUp")
      // 3) Foto: aparece justo cuando el overlay termina de desvanecerse (moveUp+0.8)
      .fromTo(imageRef.current,
        { opacity: 0, scale: 0.92, y: -80 },
        { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: "power3.out", clearProps: "opacity,transform" },
        "moveUp+=0.8"
      )
      // 4) Línea naranja: comienza cuando la foto ya está visible (moveUp+1.5)
      .fromTo(mobileAccentRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out", transformOrigin: "left center" },
        "moveUp+=1.5"
      )
      // 5) Botones aparecen en cascada después de la foto
      .fromTo(
        buttonsRef.current ? Array.from(buttonsRef.current.children) : [],
        { opacity: 0, y: 18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(1.4)", clearProps: "all" },
        "moveUp+=1.6"
      )
      // 6) Textos laterales aparecen después de los botones
      .fromTo(rightTextRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "moveUp+=1.7"
      );

      // "¿Cómo trabajo?" se revela recién cuando el usuario hace scroll hasta esa sección
      gsap.to(howIWorkRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: howIWorkRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true
        }
      });
    } else {
      // --- SECUENCIA ORIGINAL PARA PC Y TABLET ---
      // 3) Imagen aparece con desplazamiento desde arriba hacia abajo (Fade + Slide)
      tl.fromTo(imageRef.current, 
        { autoAlpha: 0, y: -150 },
        { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out" },
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
    }


    // --- MOUSE PARALLAX (Botón Contactame) ---
    xToBtn.current = gsap.quickTo(contactBtnRef.current, "x", { duration: 0.8, ease: "power3" });
    yToBtn.current = gsap.quickTo(contactBtnRef.current, "y", { duration: 0.8, ease: "power3" });
    rotXBtn.current = gsap.quickTo(contactBtnRef.current, "rotationX", { duration: 0.8, ease: "power3" });
    rotYBtn.current = gsap.quickTo(contactBtnRef.current, "rotationY", { duration: 0.8, ease: "power3" });

    // --- ANIMACION INFINITA SCROLL TEXT ---
    const scrollTl = gsap.timeline({ repeat: -1, repeatDelay: 8, delay: 1, repeatRefresh: true });
    
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

    const isMobile = window.innerWidth < 768;

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
        
        if (!isMobile && p.life > 0.5 && p.size > 1.5) {
          ctx.shadowColor = `rgba(255, 167, 38, ${alpha})`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    const animate = () => {
      const nEmpty = nameParticlesRef.current.length === 0;
      const rEmpty = roleParticlesRef.current.length === 0;
      const hidden = nCanvas.style.display === 'none';

      if (nEmpty && rEmpty && hidden) return;

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
      <div ref={introOverlayRef} className={styles.introOverlay} />
      <div className={styles.content}>
        
        <div ref={nameContainerRef} className={styles.nameContainer}>
          <div ref={nameRef} className={styles.name}>
            <div className={styles.introSparksContainer}>
              <canvas ref={nameCanvasRef} className={styles.introSparksCanvas} />
            </div>
            Alexis Delvalle
          </div>
          <div className={styles.roleContainer}>
            <div className={styles.introSparksContainer}>
              <canvas ref={roleCanvasRef} className={styles.introSparksCanvas} />
            </div>
            <div ref={roleRef} className={styles.role}>Full Stack Developer · Backend con NestJS y TypeScript · Human First.</div>
          </div>
          <div ref={mobileAccentRef} className={styles.mobileAccentLine} />
        </div>

        <div className={styles.textsContainer}>
          <div className={styles.leftColumn}>
            <div ref={imageContainerRef} className={styles.imageContainer}>
              <div ref={glowRef} className={styles.backGlow} />
              <div ref={imageRef} className={styles.imageWrapper}>
                <img ref={profileImageRef} src={profileImg} alt="Alexis Delvalle" className={styles.profileImage} />
              </div>
            </div>
            <div ref={buttonsRef} className={styles.buttonGroup}>
              <div className={styles.buttonRow1}>
                <button
                  className={styles.primaryBtn}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('navigate', { detail: { id: 'proyectos' } }));
                  }}
                >
                  Revisar proyectos
                  <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
                <a href={cvFile} download="Delvalle-Alexis-CV-full-stack-developer.docx" className={styles.primaryBtn}>
                  Descargar CV
                  <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </a>
              </div>

              <div className={styles.buttonRow2}>
                <div ref={contactBtnRef} className={styles.btn3dContainer}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={styles.btnLayer} style={{ transform: `translateZ(${-i * 2}px)` }}></div>
                  ))}
                  <a href="mailto:alexisdelvalle137@gmail.com" className={styles.secondaryBtn}>
                    Contáctame
                    <span className={styles.emojiWrapper}>
                      <span className={styles.emojis}>👁️👁️</span>
                      <img src={pleaseImg} alt="Please" className={styles.pleaseImg} />
                    </span>
                  </a>
                </div>
                <div className={styles.socialGroup}>
                  <a href="https://www.linkedin.com/in/alexis-delvalle-283081370/" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/Ale-Delvalle" target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div ref={rightTextRef} className={styles.rightColumn}>
            <div className={styles.textBlock}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </span>
                <h2 className={styles.sideTitle}>Mi perfil profesional</h2>
              </div>
              <p className={styles.sideDesc}>
                Estoy enfocado en el desarrollo backend, y desarrollo aplicaciones full stack de principio a fin: desde el diseño del modelo de datos y la API REST hasta la integración de servicios externos y el cliente web.
              </p>
              <div className={styles.tagRow}>
                <span className={styles.tag}>NodeJS</span>
                <span className={styles.tag}>PostgreSQL</span>
                <span className={styles.tag}>MongoDB</span>
                <span className={styles.tag}>React</span>
                <span className={styles.tag}>React Native</span>
                <span className={styles.tag}>CSS</span>
                <span className={styles.tag}>Docker</span>
              </div>
            </div>
            <div ref={howIWorkRef} className={styles.textBlock}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </span>
                <h2 className={styles.sideTitle}>¿Cómo trabajo?</h2>
              </div>
              <p className={styles.sideDesc}>
                
                Comunicación directa y constante, empatía, SCRUM, documentación y código limpio para entregar proyectos mantenibles y escalables.
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
