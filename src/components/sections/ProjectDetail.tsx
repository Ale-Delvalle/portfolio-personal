import { type RefObject, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectDetail.module.css';
import type { Project } from './ProjectsV2';

gsap.registerPlugin(ScrollTrigger);

type Props = {
  detail: Project | null;
  goBack: () => void;
  outerRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  firstScreenRef: RefObject<HTMLDivElement | null>;
  detailHeaderRef: RefObject<HTMLDivElement | null>;
};

export function ProjectDetail({ detail, goBack, outerRef, scrollRef, firstScreenRef, detailHeaderRef }: Props) {

  // ── Parallax + clip-path reveal (scroll-based) ─────────────
  useEffect(() => {
    if (!detail || !scrollRef.current || !outerRef.current) return;
    const scroller = scrollRef.current;
    const el = outerRef.current;
    let cleanupFn: (() => void) | null = null;

    // Wait for the open animation (~700ms) before measuring positions
    const timerId = window.setTimeout(() => {
      const imgs  = el.querySelectorAll<HTMLElement>(`.${styles.detailScreenshotImg}`);
      const cards = el.querySelectorAll<HTMLElement>(`.${styles.detailScreenshot}`);

      // Clip-path wipe reveal for screenshots beyond the first
      // (first is handled by the hero-clone entrance animation)
      const ctx = gsap.context(() => {
        cards.forEach((card, i) => {
          if (i > 0) {
            gsap.fromTo(card,
              { clipPath: 'inset(100% 0 0 0 round 12px)' },
              {
                clipPath: 'inset(0% 0 0 0 round 12px)',
                duration: 1.3,
                ease: 'expo.out',
                scrollTrigger: {
                  trigger: card,
                  scroller,
                  start: 'top 88%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          }
        });
        ScrollTrigger.refresh();
      }, el);

      // Direct scroll parallax — ScrollTrigger's element-relative offsets
      // break when content is already in the viewport at scroll=0,
      // so we drive the y directly from scrollTop.
      const onScroll = () => {
        const y = -scroller.scrollTop * 0.3;
        imgs.forEach(img => gsap.set(img, { y }));
      };
      scroller.addEventListener('scroll', onScroll, { passive: true });

      cleanupFn = () => {
        ctx.revert();
        scroller.removeEventListener('scroll', onScroll);
        imgs.forEach(img => gsap.set(img, { y: 0 }));
      };
    }, 700);

    return () => {
      window.clearTimeout(timerId);
      cleanupFn?.();
    };
  }, [detail?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3D Tilt + glare on hover ────────────────────────────────
  const handleTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const glare = card.querySelector<HTMLElement>(`.${styles.glare}`);
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    gsap.to(card, {
      rotateX: (0.5 - y) * 10,
      rotateY: (x - 0.5) * 14,
      transformPerspective: 900,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.13) 0%, transparent 62%)`;
      gsap.to(glare, { opacity: 1, duration: 0.3, overwrite: 'auto' });
    }
  }, []);

  const handleTiltReset = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const glare = card.querySelector<HTMLElement>(`.${styles.glare}`);

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.75,
      ease: 'expo.out',
      overwrite: 'auto',
    });

    if (glare) {
      gsap.to(glare, { opacity: 0, duration: 0.45, overwrite: 'auto' });
    }
  }, []);

  return (
    <div ref={outerRef} className={styles.detailView}>
      {detail && (
        <>
          <div ref={scrollRef} className={styles.detailScrollArea}>

            <div className={styles.detailHeader} ref={detailHeaderRef}>
              <h2 className={styles.detailTitle}>{detail.title}</h2>
              <p className={styles.detailDesc}>{detail.description}</p>
              <div className={styles.detailTags}>
                {detail.tags.map(tag => (
                  <span key={tag} className={styles.detailTag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles.detailGallery}>
              {detail.screenshots.map((src, i) => (
                <div
                  key={i}
                  className={styles.detailScreenshot}
                  ref={i === 0 ? firstScreenRef : undefined}
                  onMouseMove={handleTilt}
                  onMouseLeave={handleTiltReset}
                >
                  <div className={styles.detailBrowserBar}>
                    <span className={styles.detailMacDot} data-color="red"    />
                    <span className={styles.detailMacDot} data-color="yellow" />
                    <span className={styles.detailMacDot} data-color="green"  />
                    <span className={styles.detailBrowserUrl}>
                      {detail.title.toLowerCase().replace(/\s/g, '-')}.dev
                    </span>
                  </div>
                  <div className={styles.detailImgTrack}>
                    <img
                      src={src}
                      alt={`${detail.title} — pantalla ${i + 1}`}
                      className={styles.detailScreenshotImg}
                    />
                  </div>
                  <div className={styles.glare} aria-hidden="true" />
                </div>
              ))}
            </div>

          </div>

          <button className={styles.backArrowBtn} onClick={goBack} aria-label="Volver a proyectos">
            ←
          </button>

          <div className={styles.backBtnWrapper}>
            <button className={styles.backBtn} onClick={goBack}>
              <span className={styles.backArrow}>←</span>
              Volver a la sección de proyectos
            </button>
          </div>
        </>
      )}
    </div>
  );
}
