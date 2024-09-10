import type { Metadata } from "next";
import { general } from "@/app/ui/fonts";
import "./globals.sass";

import Header from "@/app/static-components/header";
import Footer from "@/app/static-components/footer";

export const metadata: Metadata = {
  title: "Ritm",
  description: "Haircuts",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${general.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
