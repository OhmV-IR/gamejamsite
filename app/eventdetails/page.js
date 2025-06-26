"use client"
import styles from './page.module.css';

export default function EventDetails() {
    return (
        <div>
            <h1 className={styles.centertext}>Event Details</h1>
            <h2 className={styles.subheader}>Competition Brackets</h2>
            <p className={styles.answertext}>Junior: 11-14 years old (middle school)</p>
            <p className={styles.answertext}>Senior: 14-18 years old (high school)</p>
            <h2 className={styles.subheader}>Date</h2>
            <p className={styles.answertext}>August 2025</p>
            <h2 className={styles.subheader}>What to Bring</h2>
            <ul>
                <li className={styles.answertext}>Your own device</li>
                <li className={styles.answertext}>Device charger</li>
                <li className={styles.answertext}>Any software you might need to create your game (ex. Scratch, VSCode, Blender)</li>
                <li className={styles.answertext}>Food and water</li>
            </ul>
            <h2 className={styles.subheader}>Competition Format</h2>
            <ul>
                <li className={styles.answertext}>The Junior and Senior groups will each be given a prompt released on the first day of the event from which they will create a game.</li>
                <li className={styles.answertext}>Games can be made in any engine or programming language, and can be 2D or 3D, but must be submitted before the gamejam deadline to qualify for judging.</li>
                <li className={styles.answertext}>Participants can choose to either work alone or as a team. Teams can either be formed ahead of time or at the event using the team finder feature on the website.</li>
                <li className={styles.answertext}>Juniors will submit their creation at the end of the day, while Seniors will be given 48 hours (2 days), including workshop time, to create and refine their game before submission.</li>
                <li className={styles.answertext}>All games submitted within the time limit will then be reviewed by our team who will assess them based on a set of criteria and decide winners.</li>
                <li className={styles.answertext}>If you are a winner, you will be displayed as such on the website, and will additionally be sent a newsletter notification if you had opted into email communications.</li>
            </ul>
            <p className={styles.normaltext}>Note: Junior attendees are required to be present in-person to take part in the competition, whereas in-person presence is optional for Senior attendees.</p>
        </div>
    )
}
