import { useState, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import styles from './ProjectDetail.module.css';
import type { Project } from './Projects';
import { GlowBackground } from '../layout/GlowBackground';

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

type Props = {
  detail: Project | null;
  goBack: () => void;
  outerRef: RefObject<HTMLDivElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  firstScreenRef: RefObject<HTMLDivElement | null>;
  detailHeaderRef: RefObject<HTMLDivElement | null>;
};

export function ProjectDetail({ detail, goBack, outerRef, scrollRef, firstScreenRef, detailHeaderRef }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    if (!detail || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % detail.screenshots.length);
  }, [detail, lightboxIndex]);

  const goPrev = useCallback(() => {
    if (!detail || lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + detail.screenshots.length) % detail.screenshots.length);
  }, [detail, lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goNext, goPrev, closeLightbox]);

  return (
    <div ref={outerRef} className={styles.detailView}>
      <GlowBackground isGallery={true} />
      {detail && (
        <>
          <div ref={scrollRef} className={styles.detailScrollArea}>

            {/* ── Header ── */}
            <div className={styles.detailHeader} ref={detailHeaderRef}>
              <div className={styles.titleAccent} />
              <h2 className={styles.detailTitle}>{detail.title}</h2>
              <p className={styles.detailDesc}>{detail.description}</p>

              {(detail.repoUrl || detail.repoFrontUrl || detail.repoBackUrl) && (
                <div className={styles.repoButtons}>
                  {detail.repoUrl && (
                    <a href={detail.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.repoBtn}>
                      <GithubIcon />
                      Ver repositorio
                      <span className={styles.repoBtnArrow}>↗</span>
                    </a>
                  )}
                  {detail.repoFrontUrl && (
                    <a href={detail.repoFrontUrl} target="_blank" rel="noopener noreferrer" className={styles.repoBtn}>
                      <GithubIcon />
                      Ver repositorio (Front)
                      <span className={styles.repoBtnArrow}>↗</span>
                    </a>
                  )}
                  {detail.repoBackUrl && (
                    <a href={detail.repoBackUrl} target="_blank" rel="noopener noreferrer" className={styles.repoBtn}>
                      <GithubIcon />
                      Ver repositorio (Back)
                      <span className={styles.repoBtnArrow}>↗</span>
                    </a>
                  )}
                </div>
              )}

              {detail.features && detail.features.length > 0 && (
                <div className={styles.detailFeatures}>
                  <h4 className={styles.featuresTitle}>Características principales</h4>
                  <ul className={styles.featuresList}>
                    {detail.features.map((feature, i) => (
                      <li key={i} className={styles.featureItem}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.detailMeta}>
                <div className={styles.detailTags}>
                  {detail.tags.map(tag => (
                    <span key={tag} className={styles.detailTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Gallery label ── */}
            <div className={styles.galleryLabel}>
              <span className={styles.galleryLabelLine} />
              <span className={styles.galleryLabelText}>Capturas del proyecto</span>
              <span className={styles.galleryLabelLine} />
            </div>

            {/* ── Collage gallery ── */}
            <div
              className={styles.collage}
              style={{ '--count': detail.screenshots.length } as React.CSSProperties}
              ref={firstScreenRef}
            >
              {detail.screenshots.map((src, i) => (
                <button
                  key={i}
                  className={`${styles.collageItem} ${styles[`item${i}`] ?? ''}`}
                  onClick={() => openLightbox(i)}
                  aria-label={`Ver captura ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`${detail.title} — captura ${i + 1}`}
                    className={styles.collageImg}
                    loading={i > 1 ? 'lazy' : 'eager'}
                  />
                  <div className={styles.collageOverlay}>
                    <span className={styles.collageOverlayIcon}>⤢</span>
                  </div>
                  <span className={styles.collageNum}>{i + 1}</span>
                </button>
              ))}
            </div>

            <div className={styles.scrollPad} />
          </div>

          {/* ── Mobile back button (top-left, only visible on mobile) ── */}
          <button className={styles.mobileBackBtn} onClick={goBack} aria-label="Volver a proyectos">
            <ArrowLeftIcon />
          </button>

          {/* ── Desktop back button (bottom-right) ── */}
          <div className={styles.backBtnWrapper}>
            <button className={styles.backBtn} onClick={goBack}>
              <ArrowLeftIcon />
              Volver a la sección de proyectos
            </button>
          </div>

          {/* ── Lightbox ── */}
          {lightboxIndex !== null && (
            <div className={styles.lightbox} onClick={closeLightbox}>
              <button
                className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                onClick={e => { e.stopPropagation(); goPrev(); }}
                aria-label="Anterior"
              >
                ←
              </button>

              <div className={styles.lightboxImgWrapper} onClick={e => e.stopPropagation()}>
                <img
                  src={detail.screenshots[lightboxIndex]}
                  alt={`${detail.title} — captura ${lightboxIndex + 1}`}
                  className={styles.lightboxImg}
                />
                <div className={styles.lightboxCounter}>
                  {lightboxIndex + 1} / {detail.screenshots.length}
                </div>
              </div>

              <button
                className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                onClick={e => { e.stopPropagation(); goNext(); }}
                aria-label="Siguiente"
              >
                →
              </button>

              <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Cerrar">
                ✕
              </button>

              {/* thumbnail strip */}
              <div className={styles.lightboxStrip} onClick={e => e.stopPropagation()}>
                {detail.screenshots.map((s, i) => (
                  <button
                    key={i}
                    className={`${styles.lightboxThumb} ${i === lightboxIndex ? styles.lightboxThumbActive : ''}`}
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Ir a captura ${i + 1}`}
                  >
                    <img src={s} alt="" className={styles.lightboxThumbImg} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
