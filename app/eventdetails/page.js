import styles from './page.module.css';

export default function EventDetails(){
    return (
        <div>
            <h1 className={styles.centertext}>Event Details</h1>
            <h2 className={styles.subheader}>Age Groups</h2>
            <p className={styles.answertext}>Junior: 11-14 years old</p>
            <p className={styles.answertext}>Senior: 14-18 years old</p>
            <h2 className={styles.subheader}>Date</h2>
            <p className={styles.answertext}>August 2025</p>
            <h2 className={styles.subheader}>What to bring</h2>
            <ul>
                <li className={styles.answertext}>Your own device</li>
                <li className={styles.answertext}>Charger for your device</li>
                <li className={styles.answertext}>Your required software such as VSCode or Blender</li>
                <li className={styles.answertext}>Food and water</li>
            </ul>
            <h2 className={styles.subheader}>Competition format</h2>
            <p className={styles.answertext}>The 2 groups, junior and senior, are each given a prompt from which they will create a game. Participants can choose to either work alone or as a team that can either be formed ahead of time
            or at the event using the team finder feature on the website. For the juniors, they will submit their creation at the end of the day while the seniors will be given additional time after the event ends
            so that they can refine their game before submitting it ahead of a deadline. The games will then be reviewed by our team, who will decide winners that will be posted on our website and sent as a newsletter 
            to those who opted in to email communications.</p>
            <p className={styles.subheader}>Junior attendees are required to be present in-person to take part in the competition</p>
            <p className={styles.subheader}>Senior attendees can either take part online or in-person</p>
        </div>
    )
}