import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import Snackbar from "@/components/Snackbar";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin-ext"],
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
