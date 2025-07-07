"use client"
import { IconSearch } from "@tabler/icons-react";
import styles from './page.module.css';
import { useState } from "react";

export default function TeamFinder() {
    const [teams, setTeams] = useState([]);

    function UpdateSearchResults(event) {
        fetch("/api/findteam?term=" + event.target.value, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                res.json().then((body) => {
                    for(let i = 0; i < body.teams.length; i++){
                        fetch("/api/fetchbasicuserinfo", {
                            method: "POST",
                            credentials: "include",
                            body: JSON.stringify({
                                uid: body.teams[i].owner.uid,
                                provider: body.teams[i].owner.provider
                            })
                        }).then((res) => {
                            if(res.ok){
                                res.json().then(userbody => {
                                    body.teams[i].ownerName = userbody.name;
                                    body.teams[i].ownerPfp = userbody.pfp;
                                })
                            }
                        })
                    }
                    setTeams(body.teams);
                });
            }
        });
    }
    
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
                        <a href={`/team/${team.id}`} key={team.id} className="btn btn-dark w-50">
                            <span>{team.name}, owned by &nbsp;&nbsp;</span>
                            <span className="avatar" style={{backgroundImage: `url(${team.ownerPfp})`}}></span>
                            <span>{team.ownerName}</span>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}