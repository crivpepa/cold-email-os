import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: "Cold Email OS — AI cold outreach in 10 seconds",
  description:
    "Paste a company URL. AI researches the company and writes five distinct cold emails — each with a different psychological angle. No signup required.",
  metadataBase: new URL("https://coldemailos.com"),
  openGraph: {
    title: "Cold Email OS",
    description:
      "Paste a URL. Get five cold emails that don't sound cold. Powered by Claude.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cold Email OS",
    description:
      "Paste a URL. Get five cold emails that don't sound cold.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
