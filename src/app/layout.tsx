import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";

export const metadata: Metadata = {
  title: "Community Profiles",
  description: "DVRPC Community Profiles Web Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
