import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://joesaunderson.co.uk"),
  title: "Joe Saunderson",
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
    <html lang="en-GB" className="antialiased">
      <body className="isolate bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
