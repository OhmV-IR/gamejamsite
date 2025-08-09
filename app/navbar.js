"use client"
import Link from "next/link";
import { IconCalendar, IconClipboardCheck, IconHome, IconInfoCircle, IconJetpack, IconLayoutDashboard, IconUserSearch, IconBrandGoogleFilled, IconAlertTriangle, IconBrandGithubFilled, IconBrandDiscordFilled, IconUsersGroup, IconBinoculars, IconMenuDeep, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from './page.module.css';
import Image from "next/image";

export default function Navbar() {

  const [name, setName] = useState("");
  const [pfpurl, setPfpurl] = useState("");
  const [role, setRole] = useState("");
  const [hasRole, setHasRole] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [mobile, setMobile] = useState(false);

  function Capitalize(str) {
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
  }

  function RedirectToGoogle() {
    fetch("/api/oauth/google/geturl", {
      method: "POST"
    }).then((res) => {
      res.json().then((json) => {
        window.location.href = json.url;
      })
    });
  }

  function RedirectToGithub() {
    fetch("/api/oauth/github/geturl", {
      method: "POST"
    }).then((res) => {
      res.json().then((json) => {
        window.location.href = json.url;
      })
    })
  }

  function RedirectToDiscord() {
    fetch("/api/oauth/discord/geturl", {
      method: "POST"
    }).then((res) => {
      res.json().then((json) => {
        window.location.href = json.url;
      })
    })
  }

  const path = usePathname();
  useEffect(() => {
    setMobile(window.innerHeight > window.innerWidth);
    var navitems = document.getElementsByClassName("nav-item");
    for (let i = 0; i < navitems.length; i++) {
      navitems[i].classList.remove("active");
      if (navitems[i].id == path) {
        navitems[i].classList.add("active");
      }
    }

    fetch("/api/fetchuserinfo", {
      method: "POST",
      credentials: "include"
    }).then((res) => {
      if (res.ok) {
        res.json().then((body) => {
          setName(body.name);
          setPfpurl(body.pfp);
          if (body.role) {
            setRole(Capitalize(body.role));
            setHasRole(true);
          }
          setIsSignedIn(true);
        });
      } else if (res.status == 307) {
        if (!path.includes("finishaccount") && !path.includes("tos") && !path.includes("privacy")) {
          window.location.href = "/finishaccount";
        }
      }
    })
  }, [path]);

  return (
    <div>
      {mobile
        // START MOBILE PAGE
        ? <div className={`container-xl ${styles.bgcolorwhite} navbar navbar-expand-md d-print-none`}>
          <Link href="/" aria-label="SiteLogo" className="navbar-brand navbar-brand-autodark me-3">
            <Image src="/favicon.svg" width={48} height={48} alt="The JamBytes logo"></Image>
            <h1>JamBytes</h1>
          </Link>
          <button className="btn btn-ghost-primary navbar-nav flex-row order-md-last ms-auto w-25" id="navbarMenuBtn" data-bs-toggle="modal" data-bs-target="#navbarModal"><IconMenuDeep></IconMenuDeep></button>
          <div className="modal" id="navbarModal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="mt-5" id="/">
                    <Link className="nav-link" href="/">
                      <span className="nav-link-icon">
                        <IconHome></IconHome>
                      </span>
                      <span className="nav-link-title"> Home </span>
                    </Link>
                  </div>
                  <div className="mt-5" id="/aboutus">
                    <Link className="nav-link" href="/aboutus">
                      <span className="nav-link-icon">
                        <IconInfoCircle></IconInfoCircle>
                      </span>
                      <span className="nav-link-title"> About us </span>
                    </Link>
                  </div>
                  <div className="mt-5" id="/eventdetails">
                    <Link className="nav-link" href="/eventdetails">
                      <span className="nav-link-icon">
                        <IconCalendar></IconCalendar>
                      </span>
                      <span className="nav-link-title"> Event Details </span>
                    </Link>
                  </div>
                  <div className="mt-5" id="/myteam">
                    <Link className="nav-link" href="/myteam">
                      <span className="nav-link-icon">
                        <IconLayoutDashboard></IconLayoutDashboard>
                      </span>
                      <span className="nav-link-title"> My Team </span>
                    </Link>
                  </div>
                  <div className="mt-5" id="/teamfinder">
                    <Link className="nav-link" href="/teamfinder">
                      <span className="nav-link-icon">
                        <IconUserSearch></IconUserSearch>
                      </span>
                      <span className="nav-link-title"> Team Finder </span>
                    </Link>
                  </div>
                  <div className="mt-5" id="/userfinder">
                    <Link className="nav-link" href="/userfinder">
                      <span className="nav-link-icon">
                        <IconUserSearch></IconUserSearch>
                      </span>
                      <span className="nav-link-title"> User Finder </span>
                    </Link>
                  </div>
                  {isSignedIn
                    ? <div className="mt-5">
                      <div className="dropdown">
                        <a href="#" className="nav-link d-flex lh-1 text-reset" data-bs-toggle="dropdown" aria-label="Open user menu">
                          <span className="avatar avatar-sm" style={{ backgroundImage: "url(" + pfpurl + ")" }}></span>
                          <div className="d-xl-block ps-2">
                            <div>{name}</div>
                            {hasRole
                              ? <div className="mt-1 small text-secondary">{role}</div>
                              : <></>
                            }
                          </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-arrow">
                          <div><Link href="/finishaccount" className="dropdown-item">Account Details</Link></div>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item text-danger" data-bs-toggle="modal" data-bs-target="#deleteaccountmodal">Delete my account</button>
                          <a href="/api/logout" className="dropdown-item text-danger">Logout</a>
                        </div>
                      </div>
                    </div>
                    : <button className="mt-5 btn btn-ghost-primary" data-bs-toggle="modal" data-bs-target="#loginmodal">
                      <span className="nav-link-icon">
                        <IconClipboardCheck></IconClipboardCheck>
                      </span>
                      <span className="nav-link-title"> Login / Register </span>
                    </button>
                  }
                </div>
                <div className="modal-footer d-flex justify-content-center align-items-center">
                  <button className="btn btn-close w-100" aria-label="Close" data-bs-dismiss="modal"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        // START PC PAGE
        : <div>
          <header className="navbar navbar-expand-md d-print-none">
            <div className="container-xl">
              <Link href="/" aria-label="SiteLogo" className="navbar-brand navbar-brand-autodark me-3">
                <Image src="/favicon.svg" width={48} height={48} alt="The JamBytes logo"></Image>
                <h1>JamBytes</h1>
              </Link>
              <ul className="navbar-nav">
                <li className="mt-5" id="/">
                  <Link className="nav-link" href="/">
                    <span className="nav-link-icon">
                      <IconHome></IconHome>
                    </span>
                    <span className="nav-link-title"> Home </span>
                  </Link>
                </li>
                <li className="mt-5" id="/aboutus">
                  <Link className="nav-link" href="/aboutus">
                    <span className="nav-link-icon">
                      <IconInfoCircle></IconInfoCircle>
                    </span>
                    <span className="nav-link-title"> About us </span>
                  </Link>
                </li>
                <li className="mt-5" id="/eventdetails">
                  <Link className="nav-link" href="/eventdetails">
                    <span className="nav-link-icon">
                      <IconCalendar></IconCalendar>
                    </span>
                    <span className="nav-link-title"> Event Details </span>
                  </Link>
                </li>
                <li className="mt-5" id="/myteam">
                  <Link className="nav-link" href="/myteam">
                    <span className="nav-link-icon">
                      <IconLayoutDashboard></IconLayoutDashboard>
                    </span>
                    <span className="nav-link-title"> My Team </span>
                  </Link>
                </li>
                <li className="mt-5" id="/teamfinder">
                  <Link className="nav-link" href="/teamfinder">
                    <span className="nav-link-icon">
                      <IconUserSearch></IconUserSearch>
                    </span>
                    <span className="nav-link-title"> Team Finder </span>
                  </Link>
                </li>
                <li className="mt-5" id="/userfinder">
                  <Link className="nav-link" href="/userfinder">
                    <span className="nav-link-icon">
                      <IconUserSearch></IconUserSearch>
                    </span>
                    <span className="nav-link-title"> User Finder </span>
                  </Link>
                </li>
                {isSignedIn
                  ? <div className="navbar-nav flex-row order-md-last ms-auto">
                    <div className="nav-item dropdown">
                      <a href="#" className="nav-link d-flex lh-1 text-reset" data-bs-toggle="dropdown" aria-label="Open user menu">
                        <span className="avatar avatar-sm" style={{ backgroundImage: "url(" + pfpurl + ")" }}></span>
                        <div className="d-xl-block ps-2">
                          <div>{name}</div>
                          {hasRole
                            ? <div className="mt-1 small text-secondary">{role}</div>
                            : <></>
                          }
                        </div>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <Link href="/finishaccount" className="dropdown-item">Account Details</Link>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item text-danger" data-bs-toggle="modal" data-bs-target="#deleteaccountmodal">Delete my account</button>
                        <a href="/api/logout" className="dropdown-item text-danger">Logout</a>
                      </div>
                    </div>
                  </div>
                  : <button className="nav-item btn btn-ghost-primary" data-bs-toggle="modal" data-bs-target="#loginmodal">
                    <span className="nav-link-icon">
                      <IconClipboardCheck></IconClipboardCheck>
                    </span>
                    <span className="nav-link-title"> Login / Register </span>
                  </button>
                }
              </ul>
            </div>
          </header>
          <div className="modal modal-xl" id="loginmodal" tabIndex={-1}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Login / Register</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                </div>
                <div className="modal-body">
                  <button type="button" className={`${styles.oauthbtn} btn btn-google mt-3 mb-3 h-25`} onClick={RedirectToGoogle}>
                    <IconBrandGoogleFilled></IconBrandGoogleFilled>&nbsp;
                    Sign in with Google
                  </button>
                  <button type="button" className={`${styles.oauthbtn} btn btn-github mb-3 h-25`} onClick={RedirectToGithub}>
                    <IconBrandGithubFilled></IconBrandGithubFilled>&nbsp;
                    Sign in with Github
                  </button>
                  <button type="button" className={`${styles.oauthbtn} btn btn-discord mb-3 h-25`} onClick={RedirectToDiscord}>
                    <IconBrandDiscordFilled></IconBrandDiscordFilled>&nbsp;
                    Sign in with Discord
                  </button>
                  <h3 className={styles.adulttext}>If you are under 13, please have your parent complete this step.</h3>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-auto" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal" id="deleteaccountmodal" tabIndex={-1}>
            <div className="modal-dialog modal-sm" role="document">
              <div className="modal-content">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div className="modal-status bg-danger"></div>
                <div className="modal-body text-center py-4">
                  <IconAlertTriangle className="text-danger"></IconAlertTriangle>
                  <h3 className="text-danger mt-3 mb-3">Are you sure?</h3>
                  <div className="text-secondary">
                    Do you really want to delete your account? This CANNOT be undone and is <strong>PERMANENT</strong>. This will also delete any teams of which you are the owner or the sole member <strong>PERMANENTLY</strong>.
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="w-100">
                    <div className="row">
                      <div className="col">
                        <a href="#" className="btn w-100" data-bs-dismiss="modal"> Cancel </a>
                      </div>
                      <div className="col">
                        <a href="/api/deleteaccount" className="btn btn-danger w-100">
                          Delete my account
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}