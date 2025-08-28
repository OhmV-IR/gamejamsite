import "./globals.css";
import Script from "next/script";
import CountdownBar from "./countdown";
import Navbar from "./navbar";
import Footer from "./footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>JamBytes</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="BoThcBk3P1jDNI6Ueg2qUCcKKPKba5xM5VbmcpSvRE8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"></link>
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/css/tabler.min.css" />
        <Script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/js/tabler.min.js"/>
      </head>
      <body>
      <Analytics></Analytics>
      <SpeedInsights></SpeedInsights>
      <CountdownBar></CountdownBar>
      <Navbar></Navbar>
        {children}
      <Footer></Footer>
      </body>
    </html>
  );
}
