"use client"
import styles from "./page.module.css"

export default function AboutUs(){
    return (
        <div style={{overflow: "hidden"}}>
        <h1 className={styles.pagetitle}>About Us</h1>
        <h1 className={styles.subheader}>Who we are</h1>
        <h2 className={styles.text}>We are a youth-led organization seeking to expand the reach of
        STEM through game development, design and artistry.</h2>
        <h1 className={styles.subheader}>How we do it</h1>
        <h2 className={styles.text}>We promote our goals by organizing and overseeing game jams, events where students come to learn
        and veterans come to create.</h2>
        <h1 className={styles.subheader}>How you can help us</h1>
        <h2 className={styles.text}>We are always appreciative of sponsorships and volunteers, please send us an email at ourteamemail@gmail.com to learn more about how you can get involved!</h2>
        </div>
    )
}