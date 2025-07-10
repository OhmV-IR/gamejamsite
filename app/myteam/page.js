"use client"

import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react"
import TeamPage from "../team/[teamid]/page";

export default function Dashboard() {
    const [isInTeam, setIsInTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamId, setTeamId] = useState("");

    function CreateTeam() {
        fetch("/api/createteam", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                teamName
            })
        }).then(res => {
            if (res.ok) {
                res.text().then(id => {
                    setIsInTeam(true);
                    setTeamId(id);
                })
            }
        });
    }

    useEffect(() => {
        fetch("/api/fetchteam", {
            method: "POST",
            credentials: "include"
        }).then(res => {
            if(res.ok){
                res.json().then(body => {
                    setTeamId(body.id);
                    setIsInTeam(true);
                });
            }
        })
    }, []);

    return (
        <div>
            {isInTeam
                ? <TeamPage params={teamId}></TeamPage>
                : <div>
                    <h1>It looks like you&apos;re not part of a team, would you like to create or join one?</h1>
                    <div className="row w-100">
                        <div className="col">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#createTeamModal" className="btn btn-primary">Create a team</button>
                        </div>
                        <div className="col">
                            <a href="/teamfinder" className="btn btn-primary">Find a team</a>
                        </div>
                    </div>
                </div>
            }
            <div className="modal" tabIndex={-1} id="createTeamModal">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create a team</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <label className="form-label">Team name</label>
                                <input type="text" className="form-control" name="teamname" placeholder="Your team name(keep it appropriate please)" value={teamName} onChange={evt => {if(evt.target.value.length <= 30){setTeamName(evt.target.value)}}}></input>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" data-bs-dismiss="modal" onClick={CreateTeam}>
                                <IconPlus></IconPlus>
                                Create new team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}