"use client"
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import styles from './page.module.css'
import { useState, useEffect } from "react";
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
        <button type="button" className="btn" onClick={RedirectToGoogle}>
            <IconBrandGoogleFilled></IconBrandGoogleFilled>&nbsp;
            Sign in with Google
        </button>
        </div>
    )
}