import { useLanguage } from '../../context/LanguageContext';
import styles from './LanguageToggle.module.css';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.toggle} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        className={`${styles.option} ${lang === 'es' ? styles.active : ''}`}
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
      <button
        type="button"
        className={`${styles.option} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
