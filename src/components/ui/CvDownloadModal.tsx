import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './CvDownloadModal.module.css';

type CvFormat = 'docx' | 'pdf';
type ModalStatus = 'choose' | 'done' | 'error';

interface CvDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  docxUrl: string;
  pdfUrl: string;
}

const FILE_INFO: Record<CvFormat, { filename: string; mime: string; description: string }> = {
  docx: {
    filename: 'Delvalle-Alexis-CV-full-stack-developer.docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Documento Word',
  },
  pdf: {
    filename: 'Delvalle-Alexis-CV-full-stack-developer.pdf',
    mime: 'application/pdf',
    description: 'Documento PDF',
  },
};

export function CvDownloadModal({ isOpen, onClose, docxUrl, pdfUrl }: CvDownloadModalProps) {
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
    const { filename, mime, description } = FILE_INFO[format];

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
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'choose' && (
          <>
            <h3 className={styles.title}>Estás por descargar el CV</h3>
            <p className={styles.description}>A continuación elige el formato</p>
            <div className={styles.formatRow}>
              <button className={styles.formatBtn} onClick={() => handleDownload('docx')}>
                Word (.docx)
              </button>
              <button className={styles.formatBtn} onClick={() => handleDownload('pdf')}>
                PDF
              </button>
            </div>
          </>
        )}

        {status === 'done' && (
          <div className={styles.statusBlock}>
            <p className={styles.statusText}>
              CV descargado, ya puedes revisar el archivo en tu{' '}
              <span className={styles.deviceWordDesktop}>PC</span>
              <span className={styles.deviceWordMobile}>dispositivo</span>
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
            <p className={styles.statusText}>Ocurrió un error al descargar el CV. Intenta nuevamente.</p>
            <button className={styles.formatBtn} onClick={() => setStatus('choose')}>
              Volver a intentar
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
