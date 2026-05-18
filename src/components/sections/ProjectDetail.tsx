import type { RefObject } from 'react';
import styles from './ProjectDetail.module.css';
import type { Project } from './ProjectsV2';

type Props = {
  detail: Project | null;
  goBack: () => void;
  outerRef: RefObject<HTMLDivElement>;
  scrollRef: RefObject<HTMLDivElement>;
};

export function ProjectDetail({ detail, goBack, outerRef, scrollRef }: Props) {
  return (
    <div ref={outerRef} className={styles.detailView}>
      {detail && (
        <>
          <div ref={scrollRef} className={styles.detailScrollArea}>

            <div className={styles.detailHeader}>
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
                <div key={i} className={styles.detailScreenshot}>
                  <div className={styles.detailBrowserBar}>
                    <span className={styles.detailMacDot} data-color="red"    />
                    <span className={styles.detailMacDot} data-color="yellow" />
                    <span className={styles.detailMacDot} data-color="green"  />
                    <span className={styles.detailBrowserUrl}>
                      {detail.title.toLowerCase().replace(/\s/g, '-')}.dev
                    </span>
                  </div>
                  <img
                    src={src}
                    alt={`${detail.title} — pantalla ${i + 1}`}
                    className={styles.detailScreenshotImg}
                  />
                </div>
              ))}
            </div>

          </div>

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
