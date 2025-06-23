import styles from './page.module.css';

export default function Privacy() {
    return (
        <div>
            <h1 className={styles.pagetitle}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy</h1>
            <h3 className={styles.maintext}><bold>Effective Date: June 23, 2025</bold></h3>
            <h3 className={styles.maintext}>JamBytes ("we", "us", "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and protect your personal information when you use our website at <a href="https://jambytes.ca">https://jambytes.ca</a> (the "Site").
                By using the Site, you agree to the collection and use of information in accordance with this policy.</h3>
            <div className="hr-text">1. Information We Collect</div>
            <h3 className={styles.maintext}>We collect information in the following ways:</h3>
            <h2 className={styles.subheader}>Information You Provide</h2>
            <ul>
                <li className={styles.maintext}>Account Information: When you register or participate in a game jam, we collect your email, name, profile picture, account identifier, account provider that you signed in with, and any other information collected through forms that you submitted.</li>
                <li className={styles.maintext}>Submissions: When you upload your game or other content, we store the submission and associated metadata, such as the time of submission.</li>
                <li className={styles.maintext}>Contact: If you reach out to us via email or contact forms, we collect that correspondence.</li>
            </ul>
            <h2 className={styles.subheader}>Automatically Collected Information</h2>
            <ul>
                <li className={styles.maintext}>Log Data: We may collect information such as your IP address, browser type, device information and time spent on the Site</li>
                <li className={styles.maintext}>Cookies: We use cookies for the purposes of authenticating users only.</li>
            </ul>
            <h3 className={styles.maintext}>You can manage or disable cookies through your browser settings.</h3>
            <div className="hr-text">2. How We Use Your Information</div>
            <h3 className={styles.maintext}>We use your information to:</h3>
            <ul>
                <li className={styles.maintext}>Provide and manage access to the Site and game jams.</li>
                <li className={styles.maintext}>Communicate with you regarding your account, submissions, or support requests.</li>
            </ul>
            <div className="hr-text">3. Sharing Your Information</div>
            <h3 className={styles.maintext}>We only share personal information in the following cases:</h3>
            <ul>
                <li className={styles.maintext}>With your consent.</li>
                <li className={styles.maintext}>To service providers who assist in hosting or supporting the platform(eg Vercel, Azure)</li>
                <li className={styles.maintext}>To comply with legal obligations or respond to lawful requests</li>
            </ul>
            <div className="hr-text">4. Data Storage and Security</div>
            <h3 className={styles.maintext}>Your information is stored on secure servers and protected using industry-standard measures. 
            However, no method of online transmission or storage is 100% secure. We encourage you to use strong passwords and keep your account secure.</h3>
            <div className="hr-text">5. Your Rights and Choices</div>
            <h3 className={styles.maintext}>Depending on your location, you may have the right to:</h3>
            <ul>
                <li className={styles.maintext}>Access, correct, or delete your personal infromation.</li>
                <li className={styles.maintext}>Withdraw consent at any time(where applicable).</li>
                <li className={styles.maintext}>Request data portability.</li>
            </ul>
            <div className="hr-text">6. Children's Privacy</div>
            <h3 className={styles.maintext}>
            The JamBytes website is intended for users aged 13 and older. 
            We do not knowingly collect personal data from children under 13. 
            If you believe a child has provided us with personal data, please contact us so we can remove it. </h3>
            <div className="hr-text">7. Retention</div>
            <h3 className={styles.maintext}>We retain your information as long as needed to provide services or meet legal obligations. You may request account deletion at any time by clicking the "Delete my Account" button
            that is visible after clicking on your profile picture from the homepage while signed in to your account.</h3>
            <div className="hr-text">8. Changes to This Privacy Policy</div>
            <h3 className={styles.maintext}>We may update this policy from time to time. 
            When we do, we will post the updated date at the top. If significant changes are made, we’ll notify users via the Site or email. </h3>
            <div className="hr-text">9. Contact</div>
            <h3 className={styles.maintext}>If you have questions about this Privacy Policy or your personal data, you can contact us at: <a className={styles.emaillink} href="mailto:jambytesteam@gmail.com">jambytesteam@gmail.com</a></h3>
            <div className="hr-text"></div>
            <h3 className={styles.maintext}>Thank you for your participation in the JamBytes competition!</h3>
        </div>
    )
}