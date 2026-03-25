import type { Metadata } from "next";
import "./globals.css";
import { InstallBanner } from "@/components/pwa/InstallBanner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://multirotter.vercel.app"),
  title: {
    default: "MultiRotter — Breaking News Forum",
    template: "%s | MultiRotter",
  },
  description:
    "Real-time breaking news scoops forum — browse threads, news flashes, and headlines",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "MultiRotter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MultiRotter — Breaking News Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <InstallBanner />
      </body>
    </html>
  );
}
