import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, DM_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { getSession } from "@/lib/server/session";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProPM — Assemble the product team you wish you had.",
  description:
    "Customizable AI agents — PRD, GTM, market research, SQL, design — working on real docs, sheets, prototypes and dashboards. One workspace instead of six tabs.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Resolved per request, so the first paint already knows who is signed in.
  const user = await getSession();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexSerif.variable} ${dmMono.variable}`}
    >
      <body>
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}
