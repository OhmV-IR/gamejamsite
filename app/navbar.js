"use client"
import Link from "next/link";
import { IconCalendar, IconClipboardCheck, IconHome, IconInfoCircle, IconJetpack, IconLayoutDashboard, IconUserSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar(){
    const path = usePathname();
    useEffect(() => {
        var navitems = document.getElementsByClassName("nav-item");
        for(let i = 0; i < navitems.length; i++){
            navitems[i].classList.remove("active");
          if(navitems[i].id == path){
            navitems[i].classList.add("active");
          }
        }
      }, [path]);
    return (
        <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <Link href="/" aria-label="SiteLogo" className="navbar-brand navbar-brand-autodark me-3">
            <IconJetpack></IconJetpack>
            <h1>JamBytes</h1>
          </Link>
          <ul className="navbar-nav">
            <li className="nav-item" id="/">
              <Link className="nav-link" href="/">
                <span className="nav-link-icon">
                  <IconHome></IconHome>
                </span>
                <span className="nav-link-title"> Home </span>
              </Link>
            </li>
            <li className="nav-item" id="/aboutus">
              <Link className="nav-link" href="/aboutus">
                <span className="nav-link-icon">
                  <IconInfoCircle></IconInfoCircle>
                </span>
                <span className="nav-link-title"> About us </span>
              </Link>
            </li>
            <li className="nav-item" id="/eventdetails">
              <Link className="nav-link" href="/eventdetails">
                <span className="nav-link-icon">
                  <IconCalendar></IconCalendar>
                </span>
                <span className="nav-link-title"> Event Details </span>
              </Link>
            </li>
            <li className="nav-item" id="/login">
              <Link className="nav-link" href="/login">
                <span className="nav-link-icon">
                  <IconClipboardCheck></IconClipboardCheck>
                </span>
                <span className="nav-link-title"> Register </span>
              </Link>
            </li>
            <li className="nav-item" id="/dashboard">
              <Link className="nav-link" href="/dashboard">
                <span className="nav-link-icon">
                  <IconLayoutDashboard></IconLayoutDashboard>
                </span>
                <span className="nav-link-title"> Contestant Dashboard </span>
              </Link>
            </li>
            <li className="nav-item" id="/teamfinder">
              <Link className="nav-link" href="/teamfinder">
                <span className="nav-link-icon">
                  <IconUserSearch></IconUserSearch>
                </span>
                <span className="nav-link-title"> Team Finder </span>
              </Link>
            </li>
          </ul>
        </div>
      </header>
    )
}