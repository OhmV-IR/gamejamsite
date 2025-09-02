"use client"
import styles from "./page.module.css";

export default function Home() {
  return (
    <div id="homepageroot">
      <div className={styles.bg}></div>
      <div className={styles.titlebox}>
        <h1 className={styles.jamtitle}>JamBytes</h1>
        <h2 className={styles.jamdetails}>A free-to-participate game jam for learners and experienced developers alike</h2>
        <h2 className={styles.jamdetails2}>Top 5</h2>
        <p className={styles.jamdetails}>1. Elementrix - Hunting-Umbra (Sathvik)</p>
        <p className={styles.jamdetails}>2. Heart Defense - deepwoken (A K)</p>
        <p className={styles.jamdetails}>3. City Without Money - Bottom of the barrel (Riley)</p>
        <p className={styles.jamdetails}>4. Stand Your Ground - C0d1ng (Jeffrey)</p>
        <p className={styles.jamdetails}>5. Platformer Game - Balar (Balar)</p>
      </div>
    </div>
  );
}
