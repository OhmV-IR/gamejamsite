"use client"
import { useState, useEffect } from "react";
import React from "react";
import styles from './page.module.css';

export default function TeamPage({ params }) {
    const { teamid } = React.use(params);
    const [teamName, setTeamName] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownerProvider, setOwnerProvider] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPfp, setOwnerPfp] = useState("");
    const [members, setMembers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);

    useEffect(() => {
        fetch("/api/fetchteaminfo", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: teamid
            })
        }).then(res => {
            if (res.ok) {
                res.json().then(body => {
                    console.log(body);
                    setTeamName(body.name);
                    setOwnerId(body.owner.uid);
                    setOwnerProvider(body.owner.provider);
                    fetch("/api/fetchbasicuserinfo", {
                        method: "POST",
                        credentials: "include",
                        body: JSON.stringify({
                            uid: body.owner.uid,
                            provider: body.owner.provider
                        })
                    }).then(res => {
                        if (res.ok) {
                            res.json().then(ownerbody => {
                                setOwnerName(ownerbody.name);
                                setOwnerPfp(ownerbody.pfp);
                            })
                        }
                    });
                    for (let i = 0; i < body.members.length; i++) {
                        fetch("/api/fetchbasicuserinfo", {
                            method: "POST",
                            credentials: "include",
                            body: JSON.stringify({
                                uid: body.members[i].uid,
                                provider: body.members[i].provider
                            })
                        }).then(res => {
                            if (res.ok) {
                                res.json().then(memberbody => {
                                    body.members[i].name = memberbody.name;
                                    body.members[i].pfp = memberbody.pfp;
                                })
                            }
                        })
                    }
                    setMembers(body.members);
                    setJoinRequests(body.joinrequests);
                    setSubmissions(body.submissions);
                })
            }
        });
        console.log(teamName);
    }, []);

    return (
        <div>
            <h1 className={`w-100 ${styles.teamname} ${styles.centeralign} mt-5`}>{teamName}</h1>
            <div className={`w-100 ${styles.centeralign} ${styles.ownertext} mt-3`}>
                Owned by:&nbsp;&nbsp;
                <button className="btn" onClick={() => window.location.href = `/user/${ownerId}/${ownerProvider}`}>
                    <span className="avatar avatar-sm" style={{ backgroundImage: `url(${ownerPfp})` }}></span>
                    &nbsp;&nbsp;{ownerName}
                </button>
            </div>
            <div className="row w-100 mt-5">
                <div className="col">
                    <h1 className={`${styles.subheader} ${styles.centeralign}`}>Members</h1>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    members.map(member => (
                                        <tr key={member.uid + member.provider}>
                                            <td>
                                                <button className="btn" onClick={() => window.location.href = `/user/${member.uid}/${member.provider}`}>
                                                    <span className="avatar avatar-sm" style={{ backgroundImage: `url(${member.pfp})` }}></span>
                                                    &nbsp;&nbsp;
                                                    <span className={styles.membername}>{member.name}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                { submissions.length > 0 
                ? <div className="col">
                    <h1 className={`${styles.subheader} ${styles.centeralign}`}>Submissions</h1>
                    <table className="table">
                        <tbody>
                            {
                                submissions.map(submission => (
                                    // Do something...
                                    <h1>Some submission</h1>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                : <></>
                }
            </div>
            { joinRequests.length > 0
            ? <div className="row w-100 mt-5">
                <div className="col">
                    <h1 className={`${styles.subheader} ${styles.centeralign}`}>Join Requests</h1>
                    <table className="table">
                        <tbody>
                            {
                                joinRequests.map(request => (
                                    // Do something...
                                    <h1>Some request</h1>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            : <></>
            }
        </div>
    )
}