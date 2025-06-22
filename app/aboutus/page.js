"use client"
import styles from "./page.module.css"
import Image from "next/image";

export default function AboutUs() {
    return (
        <div>
            <h1 className={styles.pagetitle}>About Us</h1>
            <h1 className={styles.subheader}>Who We Are</h1>
            <h2 className={styles.text}>We are a youth-led organization from the Kitchener-Waterloo region hosting the JamBytes game jam, granting the programmers of tomorrow an opportunity to excel today.</h2>
            <h1 className={styles.subheader}>Mission Statement</h1>
            <h2 className={styles.text}>We strive to educate and inspire young minds to learn, create, and play by providing them with a platform to showcase their problem-solving skills through our game jam.</h2>
            <h1 className={styles.subheader}>How you can help us</h1>
            <h2 className={styles.text}>We are always appreciative of sponsorships and volunteer offers; please send us an email at&nbsp;
                <a className={styles.emaillink} href="mailto:jambytesteam@gmail.com">jambytesteam@gmail.com</a> to learn more about how you can get involved!</h2>
            <h1 className={styles.subtitle}>Meet The Team</h1>
            <div className="row w-75">
                <div className="col">
                    <div className={styles.personcard}>
                        <div className="card">
                            <Image src="/Vishnu.jpg" alt="A portrait of Vishnu" width={1024} height={1024} ></Image>
                            <div className="card-body">
                                <h3 className="card-title">Vishnu</h3>
                                <p className="text-secondary">Lead Organizer</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className={styles.personcard}>
                        <div className="card">
                            <Image src="/Aryaman.jpeg" alt="A portrait of Aryaman" width={1024} height={1024} ></Image>
                            <div className="card-body">
                                <h3 className="card-title">Aryaman</h3>
                                <p className="text-secondary">Workshop Coordinator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row w-75">
                <div className="col">
                    <div className={styles.personcard}>
                        <div className="card">
                            <Image src="/Jared.png" alt="A portrait of Jared" width={1024} height={1024} ></Image>
                            <div className="card-body">
                                <h3 className="card-title">Jared</h3>
                                <p className="text-secondary">Workshop Coordinator</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className={styles.personcard}>
                        <div className="card">
                            <Image src="/Adrien.png" alt="A portrait of Adrien" width={1024} height={1024} ></Image>
                            <div className="card-body">
                                <h3 className="card-title">Adrien</h3>
                                <p className="text-secondary">Website Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row w-75">
                <div className="col">
                    <div className={styles.centrecard}>
                        <div className="card">
                            <Image src="/Maharshi.png" alt="A portrait of Maharshi" width={1024} height={1024} ></Image>
                            <div className="card-body">
                                <h3 className="card-title">Maharshi</h3>
                                <p className="text-secondary">Head of Marketing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
