import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { getSiteUrl } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "11s",
  description:
    "A lightweight workspace for preparing, running, and following up on recurring 1:1s.",
};

const manrope = Manrope({
  variable: "--font-manrope",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
