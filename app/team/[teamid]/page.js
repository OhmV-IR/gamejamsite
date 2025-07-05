"use client"
import { useState, useEffect } from "react";
import { IconMail, IconPlus } from "@tabler/icons-react";
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
    const [viewerUid, setViewerUid] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [uidToAdd, setUidToAdd] = useState("");
    const [providerToAdd, setProviderToAdd] = useState("");

    function RequestToJoinTeam() {
        fetch("/api/requesttojoin", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: teamid
            })
        })
    }

    function AddToTeam() {
        fetch("/api/addtoteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: teamid,
                uid: uidToAdd,
                provider: providerToAdd
            })
        });
    }

    useEffect(() => {
        fetch("/api/fetchuserinfo", {
            method: "POST",
            credentials: "include",
        }).then((res => {
            if (res.ok) {
                res.json().then(body => {
                    setViewerUid(body.userid);
                    setIsAdmin(body.permissions == "admin");
                })
            }
            fetch("/api/fetchteaminfo", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    id: teamid
                })
            }).then(res => {
                if (res.ok) {
                    res.json().then(body => {
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
        }))
    }, [teamName, teamid]);

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
            {!joinRequests.some(val => {
                return val.uid == viewerUid;
            }) && viewerUid != ""
                ? <button className="btn btn-primary" onClick={RequestToJoinTeam}>
                    <IconMail></IconMail>
                    Request to join
                </button>
                : <></>
            }
            {isAdmin || ownerId == viewerUid
                ? <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addToTeamModal">
                    <IconPlus></IconPlus>
                    Add person to team
                </button>
                : <></>
            }
            <div className="modal" id="addToTeamModal" tabIndex={-1}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add person to team</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">User id</label>
                                <input type="text" className="form-control" name="uid" placeholder="91231230142" value={uidToAdd} onChange={evt => setUidToAdd(evt.target.value)}></input>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">User provider</label>
                                <input type="text" className="form-control" name="provider" placeholder="google" value={providerToAdd} onChange={evt => setProviderToAdd(evt.target.value)}></input>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary ms-auto" data-bs-dismiss="modal" onClick={AddToTeam}>
                                <IconPlus></IconPlus>
                                Add to team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row w-100 mt-5">
                <div className="col">
                    <h1 className={`${styles.subheader} ${styles.centeralign}`}>Members</h1>
                    <div className="table-responsive">
                        <table className="table">
                            <tbody>
                                {
                                    members.map(member => (
                                        <tr key={member.uid}>
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
                {submissions.length > 0
                    ? <div className="col">
                        <h1 className={`${styles.subheader} ${styles.centeralign}`}>Submissions</h1>
                        <table className="table">
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    : <></>
                }
            </div>
            {joinRequests.length > 0
                ? <div className="row w-100 mt-5">
                    <div className="col">
                        <h1 className={`${styles.subheader} ${styles.centeralign}`}>Join Requests</h1>
                        <table className="table">
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
                : <></>
            }
        </div>
    )
}