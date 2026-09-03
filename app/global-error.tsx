"use client";

/* eslint-disable @next/next/no-html-link-for-pages */

export default function GlobalError() {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F3F4F1", color: "#12141C", fontFamily: "Arial, sans-serif" }}>
        <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: "38rem" }}>
            <p style={{ color: "#F2A63C", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cellova Labs</p>
            <h1 style={{ color: "#2D3452", fontSize: "2rem", letterSpacing: "-0.04em" }}>This information is temporarily unavailable.</h1>
            <p style={{ color: "#687087", lineHeight: 1.6 }}>Please return to the Cellova Labs storefront and try again shortly.</p>
            <a href="/" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.85rem 1.1rem", background: "#F2A63C", color: "#12141C", fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", textTransform: "uppercase" }}>Return to storefront</a>
          </div>
        </main>
      </body>
    </html>
  );
}
