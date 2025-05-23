import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@dreamwalker-studios/toasts";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.STORE_NAME ?? "Store"}`,
    default: process.env.STORE_NAME ?? "Store",
  },
  description: "A platform for the future of e-commerce",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <Toaster />
          <>{children}</>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
