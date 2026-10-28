import "@/styles/globals.css";
import localFont from "next/font/local";
import Snackbar from "@/components/Snackbar";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

const roboto = localFont({
  src: [
    {
      path: "../fonts/Roboto-VariableFont_wdth,wght.ttf",
      weight: "400 700",
      style: "normal",
    },
    {
      path: "../fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      weight: "400 700",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "Virtuální nástěnka",
  description:
    "Virtuální nástěnka pro podporu výuky na 1. stupni základních škol.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body
        className={`${roboto.variable} bg-surface text-on-surface antialiased`}
      >
        <Snackbar>
          <Suspense>
            <ThemeProvider>{children}</ThemeProvider>
          </Suspense>
        </Snackbar>
      </body>
    </html>
  );
}
