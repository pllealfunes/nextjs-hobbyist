import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/ui/theme-provider";
import { AuthProvider } from "@/contexts/authContext";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/query-provider";
import { LayoutInitializer } from "@/ui/components/layoutInitializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Hobbyist",
  description: "Share Your Hobbies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontSize: "18px",
                  padding: "16px",
                  minWidth: "300px",
                  borderRadius: "8px",
                },
              }}
            />
            <LayoutInitializer />
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
