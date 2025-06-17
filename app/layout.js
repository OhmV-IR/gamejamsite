import "./globals.css";
import Script from "next/script";
import Navbar from "./navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>GameJam site</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/css/tabler.min.css" />
        <Script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.3.2/dist/js/tabler.min.js"/>
      </head>
      <body>
      <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
