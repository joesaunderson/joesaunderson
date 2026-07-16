import type { Metadata } from "next";
import { EasterEggs } from "../components/easter-eggs";
import { Spotlight } from "../components/spotlight";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://joesaunderson.co.uk"),
  title: {
    default: "Joe Saunderson",
    template: "%s · Joe Saunderson",
  },
  description:
    "Head of Engineering at Mention Me, based in Kent. I like to get shit done.",
  openGraph: {
    title: "Joe Saunderson",
    description: "Head of Engineering at Mention Me, based in Kent.",
    url: "https://joesaunderson.co.uk",
    siteName: "Joe Saunderson",
    locale: "en_GB",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className="antialiased scheme-light-dark motion-safe:scroll-smooth"
    >
      <body className="isolate bg-canvas text-ink">
        <Spotlight />
        {children}
        <EasterEggs />
      </body>
    </html>
  );
}
