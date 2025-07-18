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
          interval: 7500,
          ride: 'carousel',
          pause: false,
        });
      }
    })
  }, []);
  return (
    <div id="homepageroot">
      <div className={styles.bg}>
        <div className={`carousel slide ${styles.bgcarousel}`} id="bgcarousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="What is JamBytes?" loading="eager" src="/carouselslide1.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="Seniors (age 14-18) will have an online senior gamejam and Juniors (age 11-14) will have an in-person Junior Gamejam in Scratch" loading="eager" src="/carouselslide2.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="All participants will make games in the specified time frame which will then be judged by the JamBytes judges" loading="eager" src="/carouselslide3.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="The senior game jam will have teams chosen by the participants while the juniors will work independently" loading="eager" src="/carouselslide4.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="the Junior gamejam will last for a day in person while the Senior game jam will be 2 days online" loading="eager" src="/carouselslide5.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="There is no entrance fee for anyone to participate in either the Junior or Senior game jams" loading="eager" src="/carouselslide6.png"></Image>
            </div>
            <div className="carousel-item">
              <Image width={0} height={0} className={`d-block ${styles.carouselimg}`} sizes="100vw" alt="Sign up for JamBytes today" loading="eager" src="/carouselslide7.png"></Image>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.titlebox}>
        <h1 className={styles.jamtitle}>JamBytes</h1>
        <h2 className={styles.jamdetails}>A free-to-participate game jam for learners and experienced developers alike</h2>
      </div>
    </div>
  );
}
