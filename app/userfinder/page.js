"use client"
import { IconSearch } from "@tabler/icons-react";
import styles from './page.module.css';
import { useState } from "react";
import Link from "next/link";

export default function UserFinder() {
    const [users, setUsers] = useState([]);

    function UpdateSearchResults(event) {
        if (event.target.value == "") {
            setUsers([]);
        }
        else {
            fetch("/api/finduser?term=" + event.target.value, {
                method: "POST",
                credentials: "include"
            }).then((res) => {
                if (res.ok) {
                    res.json().then((body) => {
                        setUsers(body.users);
                    });
                }
            });
        }
    }

    return (
        <div>
            <div className={`mb-5 mt-5 w-75 ${styles.searchbar}`}>
                <label className="form-label mb-5">Search by name</label>
                <div className="input-icon">
                    <input type="text" id="searchbar" onInput={UpdateSearchResults} className="form-control form-control-rounded" placeholder="John Doe"></input>
                    <span className="input-icon-addon">
                        <IconSearch></IconSearch>
                    </span>
                </div>
                {
                    users.map(user => (
                        <Link href={`/user/${user.id}/${user.provider}`} key={user.id} className="btn btn-dark w-100">
                            <span className="avatar" style={{ backgroundImage: `url(${user.pfp})` }}></span>
                            <span>{user.name}</span>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}