"use client"
import styles from "./page.module.css";

export default function Home() {
  return (
    <div id="homepageroot">
      <div className={styles.bg}>
        <div className={`carousel slide ${styles.bgcarousel}`} id="bgcarousel" data-bs-ride="carousel" data-bs-interval="5000" data-bs-pause="false">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img className={`d-block ${styles.carouselimg}`} alt="What is JamBytes?" src="/carouselslide1.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="Seniors (age 14-18) will have an online senior gamejam and Juniors (age 11-14) will have an in-person Junior Gamejam in Scratch" src="/carouselslide2.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="All participants will make games in the specified time frame which will then be judged by the JamBytes judges" src="/carouselslide3.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="The senior game jam will have teams chosen by the participants while the juniors will work independently" src="/carouselslide4.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="the Junior gamejam will last for a day in person while the Senior game jam will be 2 days online" src="/carouselslide5.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="There is no entrance fee for anyone to participate in either the Junior or Senior game jams" src="/carouselslide6.png"></img>
            </div>
            <div className="carousel-item">
              <img className={`d-block ${styles.carouselimg}`} alt="Sign up for JamBytes today" src="/carouselslide7.png"></img>
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
