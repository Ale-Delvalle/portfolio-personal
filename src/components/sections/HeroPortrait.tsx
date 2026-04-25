
import styles from './HeroPortrait.module.css';

export function HeroPortrait() {
  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>
      <div className={styles.portraitCard}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGaTEwWEzlKk5ZAOUwqi4MtIiCxoYy51PDZXgpQWbAt7AxcyVLdjG0IJ7e29HrIMahkhG-0tQnyJMbPIpGuq78GphMf3HYlTaZ1wM56uwK9y56dW5hCPl9Q8dpGbyClXFhmIZMnOc6a1y1Hxbf00TdE2eXoV6GlMgxCd71XBzEDm7vOPpcszlBGnnLO8DUMOT8_JuE-BcN04qeqsHdHd84_CTxXzBs-giXZ6JTl6XZamg0dZ_c93FHlY5_FJY_XrafcAHqAZ2ybLoz" 
          alt="Developer Portrait" 
          className={styles.image} 
        />
        <div className={styles.overlayTopToBottom}></div>
        <div className={styles.overlayColor}></div>
        
        <div className={styles.caption}>
          <div className={styles.badge}>001 // Core</div>
          <div className={styles.role}>Systems Architect</div>
        </div>
      </div>
    </div>
  );
}
