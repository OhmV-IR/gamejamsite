import styles from './page.module.css';

export default function TOS() {
    return (
        <div>
            <h1 className={styles.pagetitle}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Terms of Service</h1>
            <h3 className={styles.maintext}><bold>Effective Date: June 23, 2025</bold></h3>
            <h3 className={styles.maintext}>Please read these Terms of Service ("Terms") carefully before using the site.
                By accessing or using <a href="https://jambytes.ca">jambytes.ca</a>, you agree to be bound by these Terms.
                If you do not agree, you may not use the site.</h3>
            <div className="hr-text">1. Use of the Site</div>
            <h3 className={styles.maintext}>JamBytes provides tools and resources to participate in and manage game jams, submit games, and interact with other creators.
                To use certain features, you may need to create an account.
                You agree to provide accurate information and are responsible for maintaining the security of your account.
            </h3>
            <div className="hr-text">2. Game Jam Participation</div>
            <h3 className={styles.maintext}>By participating in a game jam hosted by JamBytes:</h3>
            <ul>
                <li className={styles.maintext}>You agree to follow the specific rules and guidelines provided. </li>
                <li className={styles.maintext}>You are responsible for ensuring all assets and code used in your submission are properly licensed or created by you/your team.</li>
                <li className={styles.maintext}>You retain full ownership of any game or content you create and submit, but by submitting it,
                    you grant JamBytes a non-exclusive, royalty-free license to host and display your submission for public viewing, promotion, and archival purposes. </li>
            </ul>
            <div className="hr-text">3. Content Guidelines</div>
            <h3 className={styles.maintext}>You agree not to upload, post, or otherwise transmit any content that:</h3>
            <ul>
                <li className={styles.maintext}>Infringes on intellectual property rights of others.</li>
                <li className={styles.maintext}>Is hateful, discriminatory, obscene, or otherwise offensive.</li>
                <li className={styles.maintext}>Contains malware, viruses, or other harmful content.</li>
                <li className={styles.maintext}>Violates any laws or regulations.</li>
            </ul>
            <h3 className={styles.maintext}>JamBytes reserves the right to remove content or ban users who violate these terms. 
            Additionally, all users of the website have the capability to flag user-created content they believe to be inappropriate.</h3>
            <div className="hr-text">4. Intellectual Property</div>
            <h3 className={styles.maintext}>All content and materials provided on the site, excluding user submissions, are owned by or licensed to JamBytes. 
            This includes logos, branding, and site design. 
            You may not copy, distribute, or use these materials without prior permission.</h3>
            <div className="hr-text">5. Termination</div>
            <h3 className={styles.maintext}>We may suspend or terminate your access to the site or game jams at our sole discretion if you violate these Terms or engage in behavior deemed harmful to the community.</h3>
            <div className="hr-text">6. Disclaimer of Warranties</div>
            <h3 className={styles.maintext}>The site is provided "as is" and "as available". 
            JamBytes makes no guarantees that the site will be error-free or uninterrupted. 
            We do not guarantee that participation in a jam will result in any reward, feedback, or recognition.</h3>
            <div className="hr-text">7. Limitation of Liability</div>
            <h3 className={styles.maintext}>To the maximum extent permitted by law, 
            JamBytes shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the site or participation in a game jam.</h3>
            <div className="hr-text">8. Changes to these Terms</div>
            <h3 className={styles.maintext}>We may update these Terms from time to time. 
            If we make changes, we’ll notify users via the website or email where possible. 
            Continued use of the site after changes are posted constitutes acceptance of the new Terms.</h3>
            <div className="hr-text">9. Indemnification</div>
            <h3 className={styles.maintext}>You agree to indemnify and hold harmless JamBytes, 
            its affiliates, and team members from any claims, damages, losses, or expenses arising out of your use of the site or violation of these Terms.</h3>
            <div className="hr-text">10. Contact</div>
            <h3 className={styles.maintext}>If you have questions about these Terms, you can contact us at: <a className={styles.emaillink} href="mailto:jambytesteam@gmail.com">jambytesteam@gmail.com</a></h3>
            <div className="hr-text"></div>
            <h3 className={styles.maintext}>Thank you for your participation in the JamBytes competition!</h3>
        </div>
    )
}