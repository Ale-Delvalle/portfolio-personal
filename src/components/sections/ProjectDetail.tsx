import { useState, useCallback, useEffect } from 'react';
import type { RefObject } from 'react';
import styles from './ProjectDetail.module.css';
import type { Project } from './Projects';

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
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
      {detail && (
        <>
          <div ref={scrollRef} className={styles.detailScrollArea}>

            {/* ── Header ── */}
            <div className={styles.detailHeader} ref={detailHeaderRef}>
              <div className={styles.titleAccent} />
              <h2 className={styles.detailTitle}>{detail.title}</h2>
              <p className={styles.detailDesc}>{detail.description}</p>
              
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
