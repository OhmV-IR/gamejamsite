import "./globals.css";
import Script from "next/script";
import Navbar from "./navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>GameJam site</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="BoThcBk3P1jDNI6Ueg2qUCcKKPKba5xM5VbmcpSvRE8" />
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/css/tabler.min.css" />
        <Script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/js/tabler.min.js"/>
      </head>
      <body>
      <Analytics></Analytics>
      <SpeedInsights></SpeedInsights>
      <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
