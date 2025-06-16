import { IconCalendar, IconClipboardCheck, IconHome, IconInfoCircle, IconJetpack, IconLayoutDashboard, IconUserSearch } from "@tabler/icons-react";
import Link from "next/link"

export default function Home() {
  return (
    <div id="homepageroot">
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <Link href="/" aria-label="SiteLogo" className="navbar-brand navbar-brand-autodark me-3">
            <IconJetpack></IconJetpack>
            <h1>GameJam Name</h1>
          </Link>
          <ul className="navbar-nav">
          <li className="nav-item active">
        <Link className="nav-link" href="/">
          <span className="nav-link-icon">
            <IconHome></IconHome>
          </span>
          <span className="nav-link-title"> Home </span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" href="/aboutus">
          <span className="nav-link-icon">
            <IconInfoCircle></IconInfoCircle>
          </span>
          <span className="nav-link-title"> About us </span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" href="/eventdetails">
          <span className="nav-link-icon">
            <IconCalendar></IconCalendar>
          </span>
          <span className="nav-link-title"> Event Details </span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" href="/login">
          <span className="nav-link-icon">
            <IconClipboardCheck></IconClipboardCheck>
          </span>
          <span className="nav-link-title"> Register </span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" href="/dashboard">
          <span className="nav-link-icon">
            <IconLayoutDashboard></IconLayoutDashboard>
          </span>
          <span className="nav-link-title"> Contestant Dashboard </span>
        </Link>
      </li>
      <li className="nav-item">
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
    </div>
  );
}
