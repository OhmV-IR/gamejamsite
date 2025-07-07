"use client"
import { useState, useEffect } from "react";
import { IconAlertCircle, IconCheck, IconDoorExit, IconKarate, IconMail, IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import React from "react";
import styles from './page.module.css';

export default function TeamPage({ params }) {
    let teamId = "";
    if (typeof params != "string") {
        const { teamid } = React.use(params);
        teamId = teamid;
    }
    else {
        teamId = params
    }
    const [teamName, setTeamName] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownerProvider, setOwnerProvider] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPfp, setOwnerPfp] = useState("");
    const [members, setMembers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [viewerUid, setViewerUid] = useState("");
    const [viewerProvider, setViewerProvider] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [uidToAdd, setUidToAdd] = useState("");
    const [providerToAdd, setProviderToAdd] = useState("");
    const [okBannerDisplay, setOkBannerDisplay] = useState(false);
    const [okBannerText, setOkBannerText] = useState("");
    const [failedBannerDisplay, setFailedBannerDisplay] = useState(false);
    const [failedBannerText, setFailedBannerText] = useState("");
    const [failedBannerSubtext, setFailedBannerSubtext] = useState("");

    function RequestToJoinTeam() {
        fetch("/api/requesttojoin", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: teamId
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Requested to join team. Waiting for response from team owner.");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to request to join team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function AddToTeam() {
        fetch("/api/addtoteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                id: teamId,
                uid: uidToAdd,
                provider: providerToAdd
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Added person to the team successfully.");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to add person to team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function AcceptJoinRequest(uid, provider) {
        fetch("/api/acceptjoinrequest", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                uid: uid,
                provider: provider,
                tid: teamId
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Added to team");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to add to team");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function RejectJoinRequest(uid, provider) {
        fetch("/api/rejectjoinrequest", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                uid: uid,
                provider: provider,
                tid: teamId
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Deleted join request");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to delete join request");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function LeaveTeam() {
        fetch("/api/leaveteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                tid: teamId
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Left team successfully");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to leave team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function KickFromTeam(uid, provider) {
        fetch("/api/teamkick", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                tid: teamId,
                uid: uid,
                provider: provider
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Kicked from team successfully.");
                setTimeout(() => window.location.reload(), 2000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to kick from team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    useEffect(() => {
        fetch("/api/fetchuserinfo", {
            method: "POST",
            credentials: "include",
        }).then((res => {
            if (res.ok) {
                res.json().then(body => {
                    setViewerUid(body.userid);
                    setViewerProvider(body.provider);
                    setIsAdmin(body.permissions == "admin");
                })
            }
            fetch("/api/fetchteaminfo", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    id: teamId
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
                                        setMembers(body.members);
                                    })
                                }
                            })
                        }
                        for (let i = 0; i < body.joinrequests.length; i++) {
                            fetch("/api/fetchbasicuserinfo", {
                                method: "POST",
                                credentials: "include",
                                body: JSON.stringify({
                                    uid: body.joinrequests[i].uid,
                                    provider: body.joinrequests[i].provider
                                })
                            }).then(res => {
                                if (res.ok) {
                                    res.json().then(requesterbody => {
                                        body.joinrequests[i].name = requesterbody.name;
                                        body.joinrequests[i].pfp = requesterbody.pfp;
                                        setJoinRequests(body.joinrequests);
                                    })
                                }
                            })
                        }
                        setSubmissions(body.submissions);
                    })
                }
            });
        }))
    }, [teamName, teamId]);

    return (
        <div>
            {failedBannerDisplay
                ? <div className="alert alert-danger" role="alert">
                    <div className="alert-icon">
                        <IconAlertCircle></IconAlertCircle>
                    </div>
                    <div>
                        <h4 className="alert-heading">{failedBannerText}</h4>
                        <div className="alert-description">{failedBannerSubtext}</div>
                    </div>
                </div>
                : <></>
            }
            {okBannerDisplay
                ? <div className="alert alert-success" role="alert">
                    <div className="alert-icon">
                        <IconAlertCircle></IconAlertCircle>
                    </div>
                    <div>
                        <h4 className="alert-heading">{okBannerText}</h4>
                    </div>
                </div>
                : <></>
            }
            <h1 className={`w-100 ${styles.teamname} ${styles.centeralign} mt-5`}>{teamName}</h1>
            <div className={`w-100 ${styles.centeralign} ${styles.ownertext} mt-3`}>
                Owned by:&nbsp;&nbsp;
                <button className="btn" onClick={() => window.location.href = `/user/${ownerId}/${ownerProvider}`}>
                    <span className="avatar avatar-sm" style={{ backgroundImage: `url(${ownerPfp})` }}></span>
                    &nbsp;&nbsp;{ownerName}
                </button>
            </div>
            {!joinRequests.some(val => {
                return val.uid == viewerUid && val.provider == viewerProvider;
            }) && viewerUid != "" && !members.some(val => {
                return val.uid == viewerUid && val.provider == viewerProvider
            })
                ? <button className="btn btn-primary" onClick={RequestToJoinTeam}>
                    <IconMail></IconMail>
                    Request to join
                </button>
                : <></>
            }
            {isAdmin
                ? <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#addToTeamModal">
                    <IconPlus></IconPlus>
                    Add person to team
                </button>
                : <></>
            }
            {members.some(val => {
                return val.uid == viewerUid && val.provider == viewerProvider
            })
                ? <button className="btn btn-danger" onClick={LeaveTeam}>
                    <IconDoorExit></IconDoorExit>
                    Leave team
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
                                                {isAdmin || (ownerId == viewerUid && ownerProvider == viewerProvider)
                                                    ? <button className={`btn btn-danger ${styles.lmbtn}`} onClick={() => KickFromTeam(member.uid, member.provider)}><IconKarate></IconKarate>&nbsp;Kick</button>
                                                    : <></>
                                                }
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
            {joinRequests.length > 0 && (isAdmin || (viewerUid == ownerId && viewerProvider == ownerProvider))
                ? <div className="row w-100 mt-5">
                    <div className="col">
                        <h1 className={`${styles.subheader} ${styles.centeralign}`}>Join Requests</h1>
                        <table className="table">
                            <tbody>
                                {
                                    joinRequests.map(request => (
                                        <tr key={request.uid}>
                                            <td>
                                                <button className="btn" onClick={() => window.location.href = `/user/${request.uid}/${request.provider}`}>
                                                    <span className="avatar avatar-sm" style={{ backgroundImage: `url(${request.pfp})` }}></span>
                                                    &nbsp;&nbsp;
                                                    <span className={styles.membername}>{request.name}</span>
                                                </button>
                                                <button className={`btn btn-success ${styles.lmbtn}`}><IconCheck onClick={() => AcceptJoinRequest(request.uid, request.provider)}></IconCheck></button>
                                                <button className={`btn btn-danger ${styles.lmbtn}`}><IconX onClick={() => RejectJoinRequest(request.uid, request.provider)}></IconX></button>
                                            </td>
                                        </tr>
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