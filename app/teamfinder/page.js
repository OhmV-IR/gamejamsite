"use client"
import { IconSearch } from "@tabler/icons-react";
import styles from './page.module.css';
import { useState } from "react";

export default function TeamFinder() {
    const [users, setUsers] = useState([]);

    function UpdateSearchResults(event) {
        fetch("/api/finduser?term=" + event.target.value, {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                console.log("got ok res");
                res.json().then((body) => {
                    console.log(body);
                    setUsers(body.users);
                });
            }
        });
    }
    
    return (
        <div>
            <div className={`mb-5 mt-5 w-75 ${styles.searchbar}`}>
                <label className="form-label mb-5">Search by name or email</label>
                <div className="input-icon">
                    <input type="text" id="searchbar" onInput={UpdateSearchResults} className="form-control form-control-rounded" placeholder="johndoe@example.com or John Doe"></input>
                    <span className="input-icon-addon">
                        <IconSearch></IconSearch>
                    </span>
                </div>
                {
                    users.map(user => (
                        <a href={`/user/${user.id}/${user.provider}`} key={user.id} className="btn btn-dark w-50">
                            <span className="avatar" style={{ backgroundImage: `url(${user.pfp})` }}></span>
                            <span>{user.name}</span>
                            <span>&nbsp;|&nbsp;</span>
                            <span>{user.email}</span>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}