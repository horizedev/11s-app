import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans_TC } from "next/font/google";

import { LocaleProvider } from "@/lib/i18n";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Between — Better 1:1s / 更好的一對一面談",
  description:
    "Remember the context, prepare thoughtful questions, and make every 1:1 count. 記住脈絡、準備好問題，讓每一次一對一都更有意義。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfcfb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${notoSansTC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
