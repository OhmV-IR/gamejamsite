import { IconCalendar, IconClipboardCheck, IconHome, IconInfoCircle, IconJetpack, IconLayoutDashboard, IconUserSearch } from "@tabler/icons-react";

export default function Home() {
  return (
    <div id="homepageroot">
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <a href="/" aria-label="SiteLogo" className="navbar-brand navbar-brand-autodark me-3">
            <IconJetpack></IconJetpack>
            <h1>GameJam Name</h1>
          </a>
          <ul className="navbar-nav">
          <li className="nav-item active">
        <a className="nav-link" href="/">
          <span className="nav-link-icon">
            <IconHome></IconHome>
          </span>
          <span className="nav-link-title"> Home </span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/aboutus">
          <span className="nav-link-icon">
            <IconInfoCircle></IconInfoCircle>
          </span>
          <span className="nav-link-title"> About us </span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/eventdetails">
          <span className="nav-link-icon">
            <IconCalendar></IconCalendar>
          </span>
          <span className="nav-link-title"> Event Details </span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/login">
          <span className="nav-link-icon">
            <IconClipboardCheck></IconClipboardCheck>
          </span>
          <span className="nav-link-title"> Register </span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/dashboard">
          <span className="nav-link-icon">
            <IconLayoutDashboard></IconLayoutDashboard>
          </span>
          <span className="nav-link-title"> Contestant Dashboard </span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/teamfinder">
          <span className="nav-link-icon">
            <IconUserSearch></IconUserSearch>
          </span>
          <span className="nav-link-title"> Team Finder </span>
        </a>
      </li>
          </ul>
      </div>
      </header>
    </div>
  );
}
