"use client"
import styles from './page.module.css';
import Link from 'next/link';

export default function EventDetails() {
    return (
        <div>
            <h1 className={styles.header}>Event Details</h1>
            
            <h2 className={styles.subheader}>Overview</h2>
            <ul>
                <li className={styles.answertext}>Start: August 30th, 2025 at 9AM EDT</li>
                <li className={styles.answertext}>End: September 1st, 2025 at 9AM EDT</li>
                <li className={styles.answertext}>Location: Online (check this website!)</li>
                <li className={styles.answertext}>Prizes: $125, $100, $75 for first, second, third places respectively</li>
            </ul>
            

            <h2 className={styles.subheader}>Registration Information</h2>
            <ul>
            <li className={styles.answertext}>Cost: Free!</li>
            <li className={styles.answertext}>Signup: create an account on <Link href="/">jambytes.ca</Link> (this website) by clicking the &quot;Login/Register&quot; button at the top right of the page (or in the navigation menu on mobile)</li>
            <li className={styles.answertext}>Age range: 14-18 years old (high school)</li>
            </ul>

            <h2 className={styles.subheader}>Finer Details and Regulations</h2>
            <ul>
                <li className={styles.answertext}>A prompt will be announced at the start of the game jam which participant games should be based on</li>
                 <li className={styles.answertext}>You can either work alone (in a team of 1), or with other people by having them request to join your team and you accepting that request in the <Link href="/myteam">My Team</Link> dashboard</li>
                <li className={styles.answertext}>We will accept all submissions of games from the start date to the end date, submissions outside of that time frame will not be accepted for any reason</li>
                <li className={styles.answertext}>Games can be made in any engine or programming language, and can be 2D or 3D</li>
                 <li className={styles.answertext}>Basic coding knowledge of your language&apos;s syntax is recommended, but not required</li>
                 <li className={styles.answertext}>You can use any coding language you want to create your game, we are judging the end product, not code. If you&apos;re not sure what to use, C# for the Unity game engine or Python for PyGame are some options</li>
                 <li className={styles.answertext}>If you want to find a team, it is recommended to work with people you know and communicate with them often, while delegating tasks to make sure everyone is doing something.</li>
                 <li className={styles.answertext}>When working in a team, use version control software like Git so you can all work on the code at the same time</li>
                <li className={styles.answertext}>Seniors will be given 48 hours (2 days) to create and refine their game before submission</li>
                <li className={styles.answertext}>All games submitted within the time limit will be reviewed by our team who will assess them based on a set of criteria and decide winners</li>
                <li className={styles.answertext}>If you are a winner, you will be displayed as such on the website, and prize claiming will be coordinated via email</li>
            </ul>
            
            <h2 className={styles.subheader}>How to submit your game</h2>
            <ol>
                <li className={styles.answertext}>Create an account using the Login/Register button in the top right corner of the screen (or in the navigation menu on mobile)</li>
                <li className={styles.answertext}>Create a team from the <Link href="/myteam">My Team</Link> page or request to join one from the <Link href="/teamfinder">Team Finder</Link> and have the owner of the team approve your request on the <Link href="/myteam">My Team </Link> page</li>
                <li className={styles.answertext}>Create your game and try to keep your game to a Teen ESRB rating. If we deem your game to have a Mature rating, we will remove it from download on the site but will still consider it for prizes, but if the game is Adults Only, then it will be disqualified entirely. Please use common sense and consult the ESRB guidelines for more information</li>
                <li className={styles.answertext}>Submit either your source code (preferred) or compiled product through the <Link href="/myteam">My Team</Link> page, if you need to submit a folder use a .zip file. Note that only the owner of the team can submit your game. You can resubmit as well as frequently as you want, but note that your new submission will override your previous one.</li>
                <li className={styles.answertext}>Wait for your submission to be judged by the JamBytes team, we will contact the owner of the team by email if you win a prize</li>
            </ol>
        </div>
    )
}
