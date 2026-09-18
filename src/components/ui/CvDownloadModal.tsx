import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CvDownloadModal.module.css';
import { useLanguage } from '../../context/LanguageContext';
import type { Translation } from '../../i18n/translations';

type CvFormat = 'docx' | 'pdf';
type ModalStatus = 'choose' | 'done' | 'error';

interface CvDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  docxUrl: string;
  pdfUrl: string;
}

function getFileInfo(t: Translation, format: CvFormat) {
  return format === 'docx'
    ? {
        filename: 'Delvalle-Alexis-CV-full-stack-developer.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        description: t.cvModal.docxDescription,
      }
    : {
        filename: 'Delvalle-Alexis-CV-full-stack-developer.pdf',
        mime: 'application/pdf',
        description: t.cvModal.pdfDescription,
      };
}

export function CvDownloadModal({ isOpen, onClose, docxUrl, pdfUrl }: CvDownloadModalProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<ModalStatus>('choose');

  useEffect(() => {
    if (!isOpen) return;

    setStatus('choose');
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async (format: CvFormat) => {
    const url = format === 'docx' ? docxUrl : pdfUrl;
    const { filename, mime, description } = getFileInfo(t, format);

    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{ description, accept: { [mime]: [`.${format}`] } }],
        });

        const response = await fetch(url);
        const blob = await response.blob();
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        setStatus('done');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setStatus('error');
      }
      return;
    }

    // Fallback para navegadores sin File System Access API (Firefox, Safari)
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus('done');
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${status === 'done' ? styles.modalDone : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label={t.cvModal.closeAria}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'choose' && (
          <>
            <h3 className={styles.title}>{t.cvModal.chooseTitle}</h3>
            <p className={styles.description}>{t.cvModal.chooseDescription}</p>
            <div className={styles.formatRow}>
              <button className={styles.formatBtn} onClick={() => handleDownload('docx')}>
                {t.cvModal.wordOption}
              </button>
              <button className={styles.formatBtn} onClick={() => handleDownload('pdf')}>
                {t.cvModal.pdfOption}
              </button>
            </div>
          </>
        )}

        {status === 'done' && (
          <div className={styles.statusBlock}>
            <p className={styles.statusText}>
              {t.cvModal.successPrefix}{' '}
              <span className={styles.deviceWordDesktop}>{t.cvModal.successDeviceDesktop}</span>
              <span className={styles.deviceWordMobile}>{t.cvModal.successDeviceMobile}</span>
            </p>
            <div className={styles.checkCircle}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className={styles.statusBlock}>
            <p className={styles.statusText}>{t.cvModal.errorMessage}</p>
            <button className={styles.formatBtn} onClick={() => setStatus('choose')}>
              {t.cvModal.retry}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
