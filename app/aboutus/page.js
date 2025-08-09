"use client"
import styles from "./page.module.css"
import Image from "next/image";

function createCard(src, style, alt, title, subtitle, dimx = 1024, dimy = 1024) {
    return (
        <div className="col">
            <div className={style}>
                <div className="card">
                    <Image className={styles.roundImage} src={src} alt={alt} width={dimx} height={dimy}></Image>
                    <div className="card-body-sm">
                        <div className={styles.cardtextpadding}>
                            <h3 className="card-title mt-2 mb-0">{title}</h3>
                            <p className="text-secondary">{subtitle}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AboutUs() {
    return (
        <div>
            <h1 className={styles.pagetitle}>About Us</h1>
            <h1 className={styles.subheader}>Who We Are</h1>
            <h2 className={styles.text}>We are a youth-led organization from the Kitchener-Waterloo region hosting the JamBytes game jam, granting the programmers of tomorrow an opportunity to excel today.</h2>
            <h1 className={styles.subheader}>Mission Statement</h1>
            <h2 className={styles.text}>We strive to educate and inspire young minds to learn, create, and play by providing them with a platform to showcase their problem-solving skills through our game jam.</h2>
            <h1 className={styles.subheader}>How you can help us</h1>
            <h2 className={styles.text}>We are always appreciative of sponsorships and volunteer offers; please send us an email&nbsp;
                <a className={styles.emaillink} href="mailto:jambytesteam@gmail.com">here</a> to learn more about how you can get involved!</h2>
            <h1 className={styles.subtitle}>Meet The Team</h1>
            <div className="row w-100">
                {createCard("/Vishnu.jpg", styles.personcard, "A portrait of Vishnu", "Vishnu", "Lead Organizer")}
                {createCard("/Aryaman.jpeg", styles.personcard, "A portrait of Aryaman", "Aryaman", "Workshop Coordinator")}
            </div>
            <div className="row w-100">
                {createCard("/Jared.png", styles.personcard, "A portrait of Jared", "Jared", "Workshop Coordinator")}
                {createCard("/Adrien.png", styles.personcard, "A portrait of Adrien", "Adrien", "Website Manager")}
            </div>
            <div className="row w-100">
                {createCard("/Maharshi.png", styles.centrecard, "A portrait of Maharshi", "Maharshi", "Head of Marketing")}
            </div>
        </div>
    )
}
