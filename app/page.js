"use client"
import styles from "./page.module.css";
import { useEffect } from "react";
import Image from "next/image"

export default function Home() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
      const carousel = document.getElementById('bgcarousel');
      if (carousel) {
        new bootstrap.Carousel(carousel, {
          interval: 3000,
          ride: 'carousel',
          pause: false,
        });
      }
    })
  }, []);
  return (
    <div id="homepageroot">
      <div className={styles.bg}>
        <div className={`carousel slide ${styles.bgcarousel}`} id="bgcarousel" data-bs-ride="carousel" data-bs-interval="5000" data-bs-pause="false">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide1.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide2.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide3.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide4.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide5.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide6.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="" src="/carouselslide7.png"></Image>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.titlebox}>
        <h1 className={styles.jamtitle}>JamBytes</h1>
        <h2 className={styles.jamdetails}>A game jam for learners and experienced developers alike</h2>
        <h2 className={styles.jamdetails}>Details to be announced at a later date</h2>
      </div>
    </div>
  );
}
