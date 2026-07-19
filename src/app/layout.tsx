import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VistaHome | Emlak Yönetim Paneli",
  description: "Hayalinizdeki evi bulun ya da portföyünüzü saniyeler içinde yönetin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html
  lang="tr"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
  suppressHydrationWarning
>
  <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </ThemeProvider>
  </body>
</html>
  );
}