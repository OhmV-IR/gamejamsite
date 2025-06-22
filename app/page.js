"use client"
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.querySelector("video").playbackRate = 0.3;
  }, []);
  return (
    <div id="homepageroot">
      <video autoPlay muted loop className={styles.bgvideo} id="bgvideo" controls={false}>
        <source src="homepagebg.mp4" type="video/mp4"></source>
      </video>
      <div className={styles.titlebox}>
        <h1 className={styles.jamtitle}>JamBytes</h1>
        <h2 className={styles.jamdetails}>A game jam for learners and experienced developers alike</h2>
        <h2 className={styles.jamdetails}>Details to be announced at a later date</h2>
      </div>
    </div>
  );
}
