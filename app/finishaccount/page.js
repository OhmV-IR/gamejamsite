"use client"
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { IconAlertCircle } from '@tabler/icons-react';

export default function FinishAccount() {
    const [errorBadgeVisible, setErrorBadgeVisible] = useState(false);
    const [errorBadgeText, setErrorBadgeText] = useState("");
    const [onlineDisabled, setOnlineDisabled] = useState(false);

    function DisplayErrorBadge(text) {
        setErrorBadgeText(text);
        setErrorBadgeVisible(true);
        setTimeout(() => {
            setErrorBadgeVisible(false);
        }, 5000);
    }

    function OnFinishRegistration() {
        const selectedRole = document.querySelector('input[name="roles"]:checked');
        if (!selectedRole) {
            DisplayErrorBadge("No role selected");
            return;
        }
        const selectedRoleText = selectedRole.id;
        const selectedBracket = document.querySelector('input[name="bracket"]:checked');
        if (!selectedBracket) {
            DisplayErrorBadge("Must select a competition bracket");
            return;
        }
        const selectedBracketText = selectedBracket.id;
        if (!document.getElementById("tosbox").checked) {
            DisplayErrorBadge("Must agree to Terms of Service to continue");
            return;
        }
        if (!document.getElementById("privacybox").checked) {
            DisplayErrorBadge("Must agree to Privacy Policy to continue");
            return;
        }
        if(!document.getElementById("emailbox").checked){
            DisplayErrorBadge("Must agree to email being used for communication relevant to the event.");
            return;
        }
        fetch("/api/updateaccountpreferences", {
            method: 'POST',
            body: JSON.stringify({
                role: selectedRoleText,
                experiencelevel: document.getElementById('proficiencyrange').value,
                bracket: selectedBracketText
            }),
            credentials: 'include'
        }).then((res) => {
            if (res.ok) {
                window.location.href = "/myteam";
            }
            else {
                res.text((text) => {
                    DisplayErrorBadge(text);
                })
            }
        })
    }

    const HandleJunior = (event) => {
        setOnlineDisabled(true);
    }

    const HandleSenior = (event) => {
        setOnlineDisabled(false);
    }

    useEffect(() => {
        fetch("/api/fetchuserinfo", {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                res.json().then((body) => {
                    if (body.role) {
                        document.getElementById(body.role).checked = true;
                    }
                    if (body.bracket) {
                        document.getElementById(body.bracket).checked = true;
                    }
                    if (body.experiencelevel) {
                        document.getElementById("proficiencyrange").value = body.experiencelevel;
                    }
                });
            }
        })
    }, []);

    return (
        <div className={styles.root}>
            <h1 className={styles.pagetitle}>Complete your account</h1>
            <div className="mb-3 mt-5">
                <label className="form-label">Select your competition bracket</label>
                <label className="form-check">
                    <input className="form-check-input" type="radio" id="junior" name="bracket" onChange={HandleJunior}></input>
                    <span className="form-check-label">Junior (11-14 years old, cannot attend online)</span>
                </label>
                <label className="form-check">
                    <input className="form-check-input" type="radio" id="senior" name="bracket" onChange={HandleSenior}></input>
                    <span className="form-check-label">Senior (14-18 years old)</span>
                </label>
                <label className="form-label">Which role would you prefer to take on in a team?</label>
                <div>
                    <label className="form-check">
                        <input className="form-check-input" type="radio" id="programmer" name="roles"></input>
                        <span className="form-check-label">Programmer</span>
                    </label>
                    <label className="form-check">
                        <input className="form-check-input" type="radio" id="designer" name="roles"></input>
                        <span className="form-check-label">Designer</span>
                    </label>
                    <label className="form-check">
                        <input className="form-check-input" type="radio" id="artist" name="roles"></input>
                        <span className="form-check-label">Artist</span>
                    </label>
                    <label className="form-check">
                        <input className="form-check-input" type="radio" id="other" name="roles"></input>
                        <span className="form-check-label">Other</span>
                    </label>
                </div>
                <div className="mt-5 mb-3">
                    <label className="form-label">How comfortable are you in your chosen specialty from 0-10?</label>
                    <input type="range" id="proficiencyrange" className="form-range mb-2" min="0" max="10" step="1"></input>
                    <div className={styles.rangelabels}>
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                    </div>
                </div>
                <label className="form-check">
                    <input className="form-check-input" id="tosbox" type="checkbox"></input>
                    <span className="form-check-label">I have read and agree to the <a href="/tos">Terms of Service</a></span>
                </label>
                <label className="form-check">
                    <input className="form-check-input" id="privacybox" type="checkbox"></input>
                    <span className="form-check-label">I have read and agree to the <a href="/privacy">Privacy Policy</a></span>
                </label>
                <label className="form-check">
                    <input className="form-check-input" id="emailbox" type="checkbox"></input>
                    <span className="form-check-label">I agree to my email being used for communication relevant to the event.</span>
                </label>
                {
                    errorBadgeVisible
                        ? <div className="alert alert-danger" role="alert">
                            <div className="alert-icon">
                                <IconAlertCircle></IconAlertCircle>
                            </div>
                            {errorBadgeText}
                        </div>
                        : <div></div>
                }
                <input type="submit" className="btn btn-success w-25 mt-4 mb-5" onClick={OnFinishRegistration}></input>
            </div>
        </div>
    )
}