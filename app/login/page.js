"use client"
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import styles from './page.module.css'
const dotenv = require('dotenv')
dotenv.config();

export default function Register(){

    function RedirectToGoogle(){
        fetch("/api/oauth/google/geturl", {
            method: "POST"
        }).then((res) => {
            res.json().then((json) => {
                window.location.href = json.url;
            })
        });
    }

    return (
        <div>
        <h1 className={styles.pagetitle}>Login / Register</h1>
        <button type="button" className={`${styles.oauthbtn} btn btn-google mt-4`} onClick={RedirectToGoogle}>
            <IconBrandGoogleFilled></IconBrandGoogleFilled>&nbsp;
            Sign in with Google
        </button>
        <h2 className={styles.adulttext}>If you're under 13, please ask your legal guardian to do this step for you</h2>
        </div>
    )
}