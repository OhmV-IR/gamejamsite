"use client"
import { IconSearch } from "@tabler/icons-react";
import styles from './page.module.css';
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TeamFinder() {
    const [teams, setTeams] = useState([]);
    const [browseTeams, setBrowseTeams] = useState([]);
    const [browsePage, setBrowsePage] = useState(0);
    const [browsePageIncreasable, setBrowsePageIncreasable] = useState(true);

    function UpdateSearchResults(event) {
        if(event.target.value == ""){
            setTeams([]);
            return;
        }
        fetch("/api/findteam?term=" + event.target.value, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                res.json().then((body) => {
                    for (let i = 0; i < body.teams.length; i++) {
                        fetch("/api/fetchbasicuserinfo", {
                            method: "POST",
                            credentials: "include",
                            body: JSON.stringify({
                                uid: body.teams[i].owner.uid,
                                provider: body.teams[i].owner.provider
                            })
                        }).then((res) => {
                            if (res.ok) {
                                res.json().then(userbody => {
                                    body.teams[i].ownerName = userbody.name;
                                    body.teams[i].ownerPfp = userbody.pfp;
                                    setTeams(body.teams);
                                })
                            }
                        })
                    }
                });
            }
        });
    }

    useEffect(() => {
        fetch("/api/browseteams", {
            method: "POST",
            body: JSON.stringify({
                page: browsePage
            })
        }).then(res => {
            if (res.ok) {
                res.json().then(body => {
                    if (body.teams.length == 0) {
                        setBrowsePage(browsePage - 1);
                        setBrowsePageIncreasable(false);
                    }
                    for (let i = 0; i < body.teams.length; i++) {
                        fetch("/api/fetchbasicuserinfo", {
                            method: "POST",
                            credentials: "include",
                            body: JSON.stringify({
                                uid: body.teams[i].owner.uid,
                                provider: body.teams[i].owner.provider
                            })
                        }).then((res) => {
                            if (res.ok) {
                                res.json().then(userbody => {
                                    body.teams[i].ownerName = userbody.name;
                                    body.teams[i].ownerPfp = userbody.pfp;
                                    setBrowseTeams(prev => {
                                        if(!prev.some(team => team.id == body.teams[i].id)){
                                            return [...prev, body.teams[i]];
                                        }
                                        else{
                                            return prev;
                                        }
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    }, [browsePage])

    return (
        <div>
            <div className={`mb-5 mt-5 w-75 ${styles.searchbar}`}>
                <label className="form-label mb-5">Search by team name</label>
                <div className="input-icon">
                    <input type="text" id="searchbar" onInput={UpdateSearchResults} className="form-control form-control-rounded" placeholder="The Cool Corneas"></input>
                    <span className="input-icon-addon">
                        <IconSearch></IconSearch>
                    </span>
                </div>
                {
                    teams.map(team => (
                        <Link href={`/team/${team.id}`} key={team.id} className="btn btn-dark w-50">
                            <span>{team.name}, owned by &nbsp;&nbsp;</span>
                            <span className="avatar" style={{ backgroundImage: `url(${team.ownerPfp})` }}></span>
                            <span>{team.ownerName}</span>
                        </Link>
                    ))
                }
            </div>
            <div className="hr-text">Browse teams</div>
            {
                browseTeams.map(team => (
                    <Link key={team.id} href={`/team/${team.id}`}>
                    <div className="card" key={team.id}>
                        <div className="card-body">
                            <h3 className="card-title">{team.name}</h3>
                            <p className="text-secondary">
                                Owned by:&nbsp;&nbsp;
                                <span className="avatar avatar-sm" style={{ backgroundImage: `url(${team.ownerPfp})` }}></span>
                                &nbsp;&nbsp;{team.ownerName}
                            </p>
                        </div>
                    </div>
                    </Link>
                ))
            }
            {browsePage > 0
                ? <button className="btn btn-primary ms-auto" onClick={() => setBrowsePage(browsePage - 1)}>&lt;</button>
                : <button className="btn btn-primary ms-auto" disabled>&lt;</button>
            }
            <span className="btn ms-auto">{browsePage + 1}</span>
            {browsePageIncreasable && browseTeams.length == 10
                ? <button className="btn btn-primary ms-auto" onClick={() => setBrowsePage(browsePage + 1)}>&gt;</button>
                : <button className="btn btn-primary ms-auto" disabled>&gt;</button>
            }
        </div>
    )
}