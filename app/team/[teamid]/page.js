"use client"
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { IconAlertCircle, IconAlertTriangle, IconBrandBootstrap, IconCheck, IconChevronUp, IconDeviceFloppy, IconDoorExit, IconDownload, IconKarate, IconMail, IconMinus, IconPencil, IconPlus, IconUpload, IconX } from "@tabler/icons-react";
import React from "react";
import styles from './page.module.css';
const { ContainerClient } = require("@azure/storage-blob");

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
    const [tmpTeamName, setTmpTeamName] = useState("");
    const [ownerId, setOwnerId] = useState("");
    const [ownerProvider, setOwnerProvider] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPfp, setOwnerPfp] = useState("");
    const [members, setMembers] = useState([]);
    const [submission, setSubmission] = useState({});
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
    const [canUploadCurFile, setCanUploadCurFile] = useState(false);
    const [cannotUploadReason, setCannotUploadReason] = useState("Please select a file.");
    const [isUploading, setUploading] = useState(false);

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
                fetch("/api/fetchbasicuserinfo", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        uid: viewerUid,
                        provider: viewerProvider
                    })
                }).then(res => {
                    res.json().then(body => {
                        setJoinRequests(prev => {
                            if (!prev.some(jr => jr.uid == viewerUid && jr.provider == viewerProvider)) {
                                return [...prev, { uid: viewerUid, provider: viewerProvider, name: body.name, pfp: body.pfp }]
                            } else {
                                return prev;
                            }
                        });
                    })
                });
                setTimeout(() => setOkBannerDisplay(false), 7000);
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
                fetch("/api/fetchbasicuserinfo", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        uid: uidToAdd,
                        provider: providerToAdd
                    })
                }).then(res => {
                    res.json().then(body => {
                        setMembers(prev => {
                            if (!prev.some(member => member.uid == uidToAdd && member.provider == providerToAdd)) {
                                return [...prev, { uid: uidToAdd, provider: providerToAdd, name: body.name, pfp: body.pfp }];
                            }
                            else {
                                return prev;
                            }
                        }
                        )
                    })
                });
                setTimeout(() => setOkBannerDisplay(false), 7000);
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
                fetch("/api/fetchbasicuserinfo", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({
                        uid: uid,
                        provider: provider
                    })
                }).then(res => {
                    res.json().then(body => {
                        setMembers(prev => {
                            if (!prev.some(member => member.uid == uidToAdd && member.provider == providerToAdd)) {
                                return [...prev, { uid: uidToAdd, provider: providerToAdd, name: body.name, pfp: body.pfp }]
                            }
                            else {
                                return prev;
                            }
                        });
                    })
                });
                setJoinRequests(joinRequests.filter(jr => jr.uid != uid || jr.provider != provider));
                setTimeout(() => setOkBannerDisplay(false), 7000);
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
                setJoinRequests(joinRequests.filter(jr => jr.uid != uid || jr.provider != provider));
                setTimeout(() => setOkBannerDisplay(false), 7000);
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
        if (viewerUid == ownerId && viewerProvider == ownerProvider) {
            // HACK: importing boostrapjs breaks a whole bunch of stuff, so using an invisible button to trigger the modal.
            document.getElementById('dangerTeamDeleteModalLeaveBtn').click();
        }
        else {
            LeaveTeamUnsafe(false);
        }
    }

    function KickFromTeam(uid, provider) {
        if (uid == ownerId && provider == ownerProvider) {
            // HACK: importing boostrapjs breaks a whole bunch of stuff, so using an invisible button to trigger the modal.
            document.getElementById("dangerTeamDeleteModalKickBtn").click();
            document.getElementById("dangerModalKickConfirm").onclick = () => KickFromTeamUnsafe(uid, provider, true);
        }
        else {
            KickFromTeamUnsafe(uid, provider, false);
        }
    }

    function LeaveTeamUnsafe(isdelete) {
        fetch("/api/leaveteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                tid: teamId
            })
        }).then(res => {
            if (res.ok) {
                if (isdelete) {
                    window.location.reload();
                }
                else {
                    setOkBannerDisplay(true);
                    setOkBannerText("Left team successfully");
                    setMembers(members.filter(member => member.uid != viewerUid || member.provider != viewerProvider));
                    setTimeout(() => setOkBannerDisplay(false), 7000);
                }
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to leave team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function KickFromTeamUnsafe(uid, provider, isdelete) {
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
                if (isdelete) {
                    window.location.reload();
                }
                else {
                    setOkBannerDisplay(true);
                    setOkBannerText("Kicked from team successfully.");
                    setMembers(members.filter(member => member.uid != uid || member.provider != provider));
                    setTimeout(() => setOkBannerDisplay(false), 7000);
                }
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to kick from team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function RenameTeam() {
        fetch("/api/renameteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                tid: teamId,
                name: tmpTeamName
            })
        }).then(res => {
            if (res.ok) {
                setOkBannerDisplay(true);
                setOkBannerText("Renamed team successfully.");
                setTeamName(tmpTeamName);
                setTimeout(() => setOkBannerDisplay(false), 7000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to rename team.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function TransferOwnership(uid, provider) {
        fetch("/api/transferownership", {
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
                setOkBannerText("Transferred ownership successfully.");
                setOwnerId(uid);
                setOwnerProvider(provider);
                fetch("/api/fetchbasicuserinfo", {
                    method: "POST",
                    body: JSON.stringify({
                        uid: uid,
                        provider: provider
                    })
                }).then(res => {
                    if (res.ok) {
                        res.json().then(body => {
                            setOwnerName(body.name);
                            setOwnerPfp(body.pfp);
                        })
                    }
                })
                setTimeout(() => setOkBannerDisplay(false), 7000);
            }
            else {
                setFailedBannerDisplay(true);
                setFailedBannerText("Failed to transfer ownership.");
                res.text().then(text => setFailedBannerSubtext(text));
                setTimeout(() => setFailedBannerDisplay(false), 7000);
            }
        })
    }

    function CloseSubmitDanger() {
        const closeDangerSubmitBtn = document.getElementById('dangerSubmitModalBtn');
        closeDangerSubmitBtn.click();
        const openSubmitBtn = document.getElementById('submitModalBtn');
        openSubmitBtn.click();
    }

    const maxfilesize = 750 * 1024 * 1024; // 750MB

    function HandleFile(filevt) {
        if (filevt.target.files.length < 1) {
            setCanUploadCurFile(false);
            setCannotUploadReason("Please select a file.");
            return;
        }
        if (filevt.target.files.length > 1) {
            setCanUploadCurFile(false);
            setCannotUploadReason("Only 1 file at a time. (compress folders to .zip files)");
            return;
        }
        const file = filevt.target.files[0];
        if (file.size > maxfilesize) {
            setCanUploadCurFile(false);
            setCannotUploadReason("File is too large, try compressing it to under 750MB using .zip or a similar format (or contact us for support)");
            return;
        }
        setCanUploadCurFile(true);
    }

    function UploadSubmission() {
        const file = document.getElementById("submissionFile").files[0];
        file.arrayBuffer().then(buf => {
            fetch("/api/startsubmission", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    filename: file.name
                })
            }).then(res => {
                if (res.ok) {
                    res.json().then(body => {
                        if (body.url == null) return;
                        const submissionContainer = new ContainerClient(body.url);
                        const blob = submissionContainer.getBlockBlobClient(teamId);
                        blob.uploadData(buf, {
                            blobHTTPHeaders: {
                                blobContentDisposition: 'attachment; filename="' + file.name + '"'
                            }
                        }).then(res => {
                            setOkBannerDisplay(true);
                            setOkBannerText("Uploaded submission successfully");
                            setTimeout(() => setOkBannerDisplay(false), 7000);
                            document.getElementById('closeSubmissionModal').click();
                            console.log("uploaded successfully");
                            setUploading(false);
                            setSubmission({state: 1, filename: file.name, url: blob.url, uploadtime: (new Date()).toISOString(), size: file.size})
                        }, (err) => {
                            setFailedBannerDisplay(true);
                            setFailedBannerText("Failed to upload submission.");
                            setFailedBannerSubtext(err);
                            setTimeout(() => setFailedBannerDisplay(false), 7000);
                            console.error("failed to upload: ");
                            console.error(err);
                            setUploading(false);
                        })
                    })
                }
            })
        });
        setUploading(true);
    }

    function DownloadUrlToName(url, filename) {
        fetch(url).then(res => {
            res.blob().then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(blobUrl);
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
                                        setMembers(prev => {
                                            if (!prev.some(member => member.uid == body.members[i].uid && member.provider == body.members[i].provider)) {
                                                return [...prev, { uid: body.members[i].uid, provider: body.members[i].provider, name: memberbody.name, pfp: memberbody.pfp }];
                                            }
                                            else {
                                                return prev;
                                            }
                                        })
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
                                        setJoinRequests(prev => {
                                            if (!prev.some(jr => jr.uid == body.joinrequests[i].uid && jr.provider == body.joinrequests[i].provider)) {
                                                return [...prev, body.joinrequests[i]];
                                            }
                                            else {
                                                return prev;
                                            }
                                        });
                                    })
                                }
                            })
                        }
                        setSubmission(body.submission);
                    })
                }
            });
        }))
    }, [teamId]);

    return (
        <div>
            <button id="dangerTeamDeleteModalLeaveBtn" type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#dangerTeamDeleteModalLeave"></button>
            <button id="dangerTeamDeleteModalKickBtn" type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#dangerTeamDeleteModalKick"></button>
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
            <h1 className={`w-100 ${styles.teamname} ${styles.centeralign} mt-5`}>{teamName}&nbsp;&nbsp;
                {isAdmin || (ownerId == viewerUid && ownerProvider == viewerProvider)
                    ? <button className="btn" data-bs-toggle="modal" data-bs-target="#renameTeamModal"><IconPencil></IconPencil></button>
                    : <></>
                }</h1>
            <div className="modal" tabIndex={-1} id="renameTeamModal">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Rename team</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label className="form-label">Team name</label>
                                <input type="text" className="form-control" name="teamname" placeholder="Your team name(keep it appropriate please)" value={tmpTeamName} onChange={evt => { if (evt.target.value.length <= 30) { setTmpTeamName(evt.target.value) } }}></input>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            {tmpTeamName.length > 0
                                ? <button className="btn btn-primary" data-bs-dismiss="modal" onClick={RenameTeam}>
                                    <IconDeviceFloppy></IconDeviceFloppy>
                                    Rename team
                                </button>
                                : <button className="btn btn-primary" disabled>
                                    <IconDeviceFloppy></IconDeviceFloppy>
                                    Rename team
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
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
            {isAdmin && ownerId == viewerUid && ownerProvider == viewerProvider && submission.size == null
                ? <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#submitModal"><IconUpload></IconUpload>Upload submission</button>
                : <></>
            }
            {isAdmin && ownerId == viewerUid && ownerProvider == viewerProvider && submission.size != null
                ? <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dangerSubmitModal"><IconUpload></IconUpload>Upload submission</button>
                : <></>
            }
            <button className="d-none" data-bs-toggle="modal" data-bs-target="#submitModal" id="submitModalBtn"></button>
            <button className="d-none" data-bs-toggle="modal" data-bs-target="#dangerSubmitModal" id="dangerSubmitModalBtn"></button>
            <div className="modal" id="dangerSubmitModal" tabIndex={-1}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                        <div className="modal-status bg-danger"></div>
                        <div className="modal-body text-center py-4">
                            <IconAlertTriangle className="text-danger"></IconAlertTriangle>
                            <h3>Are you sure?</h3>
                            <div className="text-secondary">
                                Uploading another file will overwrite your old submission. The old submission will be permanently deleted and cannot be recovered.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-danger ms-auto" onClick={CloseSubmitDanger}>Continue</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="submitModal" tabIndex={-1}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload submission</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <label className="form-label">Upload your file, for folders compress to a .zip first.</label>
                            <input type="file" id="submissionFile" onChange={evt => HandleFile(evt)}></input>
                        </div>
                        <div className="modal-footer">
                            {canUploadCurFile
                                ? <></>
                                : <div className="alert alert-danger w-100" role="alert">
                                    <div className="alert-icon">
                                        <IconAlertCircle className="icon alert-icon icon-2"></IconAlertCircle>
                                    </div>
                                    <div>
                                        <h4 className="alert-heading">Upload restricted until the following issue is resolved:</h4>
                                        <div className="alert-description">
                                            {cannotUploadReason}
                                        </div>
                                    </div>
                                </div>
                            }
                            <button className="d-none" data-bs-dismiss="modal" id="closeSubmissionModal"></button>
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            {canUploadCurFile
                                ? <button className="btn btn-primary ms-auto" onClick={UploadSubmission}>{isUploading ? <div className="spinner-border text-white"></div> : <IconUpload></IconUpload>}&nbsp;&nbsp;Upload</button>
                                : <button className="btn btn-primary ms-auto disabled" disabled><IconUpload></IconUpload>Upload</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
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
            <div className="modal" id="dangerTeamDeleteModalLeave" tabIndex={-1}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                        <div className="modal-status bg-danger"></div>
                        <div className="modal-body text-center py-4">
                            <IconAlertTriangle></IconAlertTriangle>
                            <h3>Are you sure?</h3>
                            <div className="text-secondary">
                                This will delete your team, irreversibly and permanently.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="w-100">
                                <div className="row">
                                    <div className="col">
                                        <a href="#" className="btn w-100" data-bs-dismiss="modal"> Cancel </a>
                                    </div>
                                    <div className="col">
                                        <a href="#" className="btn btn-danger w-100" data-bs-dismiss="modal" onClick={() => LeaveTeamUnsafe(true)}>
                                            Delete my team FOREVER </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal" id="dangerTeamDeleteModalKick" tabIndex={-1}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                        <div className="modal-status bg-danger"></div>
                        <div className="modal-body text-center py-4">
                            <IconAlertTriangle></IconAlertTriangle>
                            <h3>Are you sure?</h3>
                            <div className="text-secondary">
                                This will delete your team, irreversibly and permanently.
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="w-100">
                                <div className="row">
                                    <div className="col">
                                        <a href="#" className="btn w-100" data-bs-dismiss="modal"> Cancel </a>
                                    </div>
                                    <div className="col">
                                        <a href="#" className="btn btn-danger w-100" data-bs-dismiss="modal" id="dangerModalKickConfirm">
                                            Delete my team FOREVER </a>
                                    </div>
                                </div>
                            </div>
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
                                                {(isAdmin || (ownerId == viewerUid && ownerProvider == viewerProvider)) && (member.uid != ownerId || member.provider != ownerProvider)
                                                    ? <button className={`btn btn-warning ${styles.lmbtn}`} data-bs-toggle="modal" data-bs-target={`#${member.uid}PromoteModal`}><IconChevronUp></IconChevronUp>Promote to Owner</button>
                                                    : <></>
                                                }
                                                <div className="modal" id={`${member.uid}PromoteModal`}>
                                                    <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Promote {member.name} to Owner</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-status bg-danger"></div>
                                                            <div className="modal-body text-center py-4">
                                                                <IconAlertTriangle className="text-danger" size={64}></IconAlertTriangle>
                                                                <h3>Are you sure?</h3>
                                                                <div className="text-secondary">
                                                                    Do you really want to promote {member.name} to Owner? This cannot be undone and they will gain full control of the team, effective immediately.
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <div className="w-100">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <button className="btn btn-ghost w-100" data-bs-dismiss="modal">Cancel</button>
                                                                        </div>
                                                                        <div className="col">
                                                                            <button className="btn btn-danger w-100" data-bs-dismiss="modal" onClick={() => TransferOwnership(member.uid, member.provider)}> Transfer Ownership </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {submission.size != null
                    ? <div className="col">
                        <h1 className={`${styles.subheader} ${styles.centeralign}`}>Submission</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Filename</th>
                                    <th>Upload time</th>
                                    <th>Size</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={submission.id}>
                                    <td>{submission.filename}</td>
                                    <td className="text-secondary">{(new Date(submission.uploadtime)).toLocaleString()}</td>
                                    <td className="text-secondary">{submission.size / 1000000}MB</td>
                                    <td><button className="btn btn-primary" onClick={() => DownloadUrlToName(submission.url, submission.filename)}><IconDownload></IconDownload>Download</button></td>
                                </tr>
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