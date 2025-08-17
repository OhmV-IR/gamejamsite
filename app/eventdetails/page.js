"use client"
import styles from './page.module.css';
import Link from 'next/link';

export default function EventDetails() {
    return (
        <div>
            <h1 className={styles.header}>Event Details</h1>
            <h2 className={styles.subheader}>Competition Brackets</h2>
            <p className={styles.answertext}>Junior: 11-14 years old (middle school)</p>
            <p className={styles.answertext}>Senior: 14-18 years old (high school)</p>

            <h2 className={styles.subheader}>Registration Information</h2>
            <p className={styles.answertext}>Cost: Free!</p>
            <p className={styles.answertext}>Signup</p>
            <u1>
                <li className={styles.answertext}>Senior section: create an account on <Link href="/">jambytes.ca</Link> (this website) by clicking the &quot;Login/Register&quot; button at the top right of the page</li>
                <li className={styles.answertext}>Junior section: sign up via Google Forms (<a href="https://forms.gle/Z6U9KK6FJvuaMkG68">https://forms.gle/Z6U9KK6FJvuaMkG68</a>)</li>
            </u1>


            <h1 className={styles.header}>Senior Event</h1>
            <h2 className={styles.subheader}>Event Details</h2>
            <u1>
                <li className={styles.answertext}>Date: August 30-31, 2025</li>
                <li className={styles.answertext}>Location: Online (check this website!)</li>
                <li className={styles.answertext}>Prizes: $125, $100, $75 for first, second, third places respectively</li>
            </u1>

            <h2 className={styles.subheader}>Overview</h2>
            <ul>
                <li className={styles.answertext}>A prompt will be announced at the start of the game jam which participant games should be based on</li>
                <li className={styles.answertext}>Games can be made in any engine or programming language, and can be 2D or 3D</li>
                <li className={styles.answertext}>Teams should be created using the Team Finder feature on the website (teams of four are recommended, however groups of any size — including solo participants — are welcome)</li>
                <li className={styles.answertext}>Seniors will be given 48 hours (2 days) to create and refine their game before submission</li>
                <li className={styles.answertext}>All games submitted within the time limit will be reviewed by our team who will assess them based on a set of criteria and decide winners</li>
                <li className={styles.answertext}>If you are a winner, you will be displayed as such on the website, and prize claiming will be coordinated via email</li>
            </ul>


            <h1 className={styles.header}>Junior Event</h1>
            <h2 className={styles.subheader}>Event Details</h2>
            <ul>
                <li className={styles.answertext}>An in-person Scratch game-building competition with workshops</li>
                <li className={styles.answertext}>Location: Kitchener Public Library Central Branch (85 Queen St N, Kitchener, ON N2H 2H1)</li>
                <li className={styles.answertext}>Date: August 23, 2025 (9:30AM-4:00PM)</li>
                <li className={styles.answertext}>Parental supervision recommended but not required</li>
            </ul>

            <h2 className={styles.subheader}>Workshops</h2>
            <ul>
                <li className={styles.answertext}>Scratch Essentials</li>
                <li className={styles.answertext}>Advanced Scratch</li>
                <li className={styles.answertext}>Introduction to PyGame</li>
            </ul>

            <h2 className={styles.subheader}>What to Bring</h2>
            <ul>
                <li className={styles.answertext}>Your own device (preferrably a personal computer)</li>
                <li className={styles.answertext}>Device charger</li>
                <li className={styles.answertext}>A set-up Scratch account</li>
                <li className={styles.answertext}>Food and water (no nuts please!)</li>
                <li className={styles.answertext}>Any required medication</li>
            </ul>
        </div>
    )
}
