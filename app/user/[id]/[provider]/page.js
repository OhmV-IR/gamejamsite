"use client"
import { IconDeviceFloppy } from '@tabler/icons-react';
import styles from './page.module.css'
import React from "react"
import { useEffect, useState } from "react"
import Image from "next/image";

export default function UserPage({ params }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [pfp, setPfp] = useState("");
    const [roleclass, setRoleClass] = useState("");
    const [attendeetype, setAttendeetype] = useState("");
    const [isLookingForTeam, setIsLookingForTeam] = useState(false);
    const [bracket, setBracket] = useState("");
    const [experienceLevel, setExperienceLevel] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const { id, provider } = React.use(params);

    function SaveAccountChanges() {
        fetch("/api/updateaccountpreferences?id=" + id + "&provider=" + provider, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name: name,
                email: email,
                pfp: pfp,
                role: role,
                permissions: isAdmin ? "admin" : "user",
                attendeetype: attendeetype,
                experiencelevel: experienceLevel,
                lookingforteam: isLookingForTeam,
                bracket: bracket
            })
        });
    }

    useEffect(() => {
        fetch("/api/getuser?id=" + id + "&provider=" + provider, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                res.json().then((body) => {
                    setName(body.name);
                    setEmail(body.email);
                    setRole(body.role);
                    setPfp(body.pfp);
                    setBracket(body.bracket);
                    setExperienceLevel(body.experiencelevel);
                    setIsAdmin(body.permissions == "admin");
                    setIsUserAdmin(body.containsprivate);
                    if (body.role == "programmer") {
                        setRoleClass("bg-azure");
                    }
                    else if (body.role == "artist") {
                        setRoleClass("bg-pink")
                    }
                    else if (body.role == "designer") {
                        setRoleClass("bg-lime");
                    }
                    else {
                        setRoleClass("bg-purple");
                    }
                })
            }
            else {
                window.location.href = "/teamfinder";
            }
        });
    }, [id, provider]);

    function Capitalize(inputstr) {
        if (typeof inputstr == "string") {
            return inputstr.charAt(0).toUpperCase() + inputstr.slice(1);
        }
        else {
            return null;
        }
    }

    return (
        <div>
            <div className={`card ${styles.profilecard}`}>
                <Image className={`${styles.roundimage}`} src={pfp == "" ? "/favicon.svg" : pfp} width={1024} height={1024} alt={`${name}'s profile picture`}></Image>
                <div className="card-body">
                    <h3 className="card-title">{name}</h3>
                    <span className={`badge ${roleclass}`}>
                        <span className={styles.roletext}>{Capitalize(role)}</span>
                    </span>
                    {isAdmin
                        ? <span className="badge bg-github">
                            <span className={styles.roletext}>JamBytes Team Member</span>
                        </span>
                        : <></>
                    }
                    {isUserAdmin
                        ? <button className="btn btn-indigo" data-bs-toggle="modal" data-bs-target="#editaccountmodal">Edit account settings</button>
                        : <></>
                    }
                </div>
            </div>
            <div className="modal" id="editaccountmodal" tabIndex={-1}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit account settings</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" name="name" value={name || ""} onChange={(evt) => setName(evt.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="text" className="form-control" name="email" value={email || ""} onChange={(evt) => setEmail(evt.target.value)}></input>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Profile picture link</label>
                                <input type="text" className="form-control" name="pfp" value={pfp || ""} onChange={(evt) => setPfp(evt.target.value)}></input>
                            </div>
                            <label className="form-label">Attendance Type</label>
                            <div className="form-selectgroup-boxes row mb-3">
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="attendancetype" className="form-selectgroup-input" checked={attendeetype == "inperson"} onChange={() => { setAttendeetype("inperson") }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">In-person</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="attendancetype" className="form-selectgroup-input" checked={attendeetype == "online"} onChange={() => { setAttendeetype("online") }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">Online</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <label className="form-label">Permission level</label>
                            <div className="form-selectgroup-boxes row mb-3">
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="permissionlevel" className="form-selectgroup-input" checked={!isAdmin} onChange={() => { setIsAdmin(false) }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">User</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="permissionlevel" className="form-selectgroup-input" checked={isAdmin} onChange={() => { setIsAdmin(true) }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">Admin</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <label className="form-label">Bracket</label>
                            <div className="form-selectgroup-boxes row mb-3">
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="bracket" className="form-selectgroup-input" checked={bracket == "junior"} onChange={() => { setBracket("junior") }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">Junior</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-selectgroup-item">
                                        <input type="radio" name="bracket" className="form-selectgroup-input" checked={bracket == "senior"} onChange={() => { setBracket("senior") }} />
                                        <span className="form-selectgroup-label d-flex align-items-center p-3">
                                            <span className="me-3">
                                                <span className="form-selectgroup-check"></span>
                                            </span>
                                            <span className="form-selectgroup-label-content">
                                                <span className="form-selectgroup-title strong mb-1">Senior</span>
                                            </span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <label className="form-label">Role</label>
                            <div>
                                <label className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" checked={role == "programmer"} onChange={() => setRole("programmer")}></input>
                                    <span className="form-check-label">Programmer</span>
                                </label>
                                <label className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" checked={role == "designer"} onChange={() => setRole("designer")}></input>
                                    <span className="form-check-label">Designer</span>
                                </label>
                                <label className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" checked={role == "artist"} onChange={() => setRole("artist")}></input>
                                    <span className="form-check-label">Artist</span>
                                </label>
                                <label className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="role" checked={role == "other"} onChange={() => setRole("other")}></input>
                                    <span className="form-check-label">Other</span>
                                </label>
                            </div>
                            <label className="form-check form-check-inline mt-3">
                                <input className="form-check-input" type="checkbox" name="lookingforteam" checked={isLookingForTeam || false} onChange={() => { setIsLookingForTeam(!isLookingForTeam) }} />
                                <span className="form-check-label">Looking for team</span>
                            </label>
                            <div className="mt-5 mb-3">
                                <label className="form-label">Experience level</label>
                                <input type="range" id="proficiencyrange" className="form-range mb-2" min="0" max="10" step="1" value={experienceLevel || 0} onChange={(evt) => setExperienceLevel(evt.target.value)}></input>
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
                        </div>
                        <div className="modal-footer">
                            <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal"> Cancel </a>
                            <a href="#" className="btn btn-primary ms-auto" data-bs-dismiss="modal" onClick={SaveAccountChanges}>
                                <IconDeviceFloppy></IconDeviceFloppy>
                                Save changes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}