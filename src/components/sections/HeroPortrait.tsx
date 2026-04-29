import styles from './HeroPortrait.module.css';
import portraitImg from '../../assets/foto-transparente.png';

export function HeroPortrait() {
  return (
    <div className={styles.container}>

      <div className={styles.portraitCard}>
        <img 
          src={portraitImg}
          alt="Developer Portrait"
          className={styles.image}
        />
      </div>
    </div>
  );
}
