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
                <li className={styles.answertext}>Submissions Due: September 1st, 2025 at 9AM EDT (48  hours after start)</li>
            <li className={styles.answertext}>Location: Online (check this website!)</li>
                <li className={styles.answertext}>Prizes: $125/$100/$75/$50/$25 for first to fifth place</li>
            </ul>
            

            <h2 className={styles.subheader}>Registration Information</h2>
            <ul>
            <li className={styles.answertext}>Cost: Free!</li>
            <li className={styles.answertext}>Signup: create an account on <Link href="/">jambytes.ca</Link> (this website) by clicking the &quot;Login/Register&quot; button at the top right of the page (or in the navigation menu on mobile)</li>
            <li className={styles.answertext}>Age range: 14-18 years old (high school)</li>
            </ul>

            <h2 className={styles.subheader}>Additional Details and Regulations</h2>
            <ul>
                <li className={styles.answertext}>Theme: At the start of the game jam, a general theme will be released to base games on</li>
                <li className={styles.answertext}>Teams: You can either work alone (in a one-person team), or with other people (they can request to join your team, which can be accepted in the <Link href="/myteam">My Team</Link> dashboard)</li>
                <li className={styles.answertext}>Submission Qualifications: We will accept all game submissions within the allotted timeframe (see Event Details) - submissions outside of that timeframe will not be accepted</li>
                <li className={styles.answertext}>Prerequisite Skills: Basic coding knowledge of your language&apos;s syntax is recommended, but not required</li>
                <li className={styles.answertext}>Game Development: Games can be made in any game engine or programming language, and can be 2D or 3D (we are judging the end product, not the code - if you're not sure what to use, options include Unity Game Engine and PyGame)</li>
                <li className={styles.answertext}>Judging: All games will be reviewed by our team and will be judged via a set of predefined criteria to determine winners</li>
                <li className={styles.answertext}>Winners: If you are a winner, you will be displayed as such on the website, and prize claiming will be coordinated via email</li>
                <li className={styles.answertext}>Tip - Teams: If you want to find a team, it is recommended to work with people you know and communicate with them often, while delegating tasks to make sure everyone is doing something.</li>
                <li className={styles.answertext}>Tip - Programming: When working in a team, use version control software (ex. Git) so you can all work on the code at the same time</li>
            </ul>

            <h2 className={styles.subheader}>Judging Criteria</h2> 
            <ul>
                <li className={styles.answertext}>Theme: How well your game incorporates the given theme - be creative!</li> 
                <li className={styles.answertext}>Game Mechanics: Level of engagement in gameplay and and ease of controls</li> 
                <li className={styles.answertext}>Audio and Graphics: Presence and effective use of both sound and visuals in enhancing the game experience</li> 
                <li className={styles.answertext}>Originality: Uniqueness in your game&apos;s concept and execution</li> 
            </ul>
        
            <h2 className={styles.subheader}>How to submit your game</h2>
            <ol>
                <li className={styles.answertext}>Create an account using the Login/Register button (computer - top right corner of the screen, mobile - navigation menu)</li>
                <li className={styles.answertext}>Create a team from the <Link href="/myteam">My Team</Link> page or request to join one from the <Link href="/teamfinder">Team Finder</Link> (the team owner needs to approve your request on the <Link href="/myteam">My Team </Link> page)</li>
                <li className={styles.answertext}>Create your game - keep your game to a Teen ESRB rating (Mature-rated games will be removed from the site but will still be considered for prizes, but Adults Only games will be disqualified entirely. Please use common sense and consult the ESRB guidelines for more information.)</li>
                <li className={styles.answertext}>Submit either your source code (preferred) or compiled product through the <Link href="/myteam">My Team</Link> page (if you need to submit a folder, use a .zip file. Only the owner of the team can submit your game. You can resubmit as frequently as you want - your new submission will override your previous one.)</li>
                <li className={styles.answertext}>Wait for your submission to be judged by the JamBytes team (we will contact the team owner by email if you win a prize)</li>
            </ol>
        </div>
    )
}
