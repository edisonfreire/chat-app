import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/providers/theme-provider";
import { ClerkProvider } from '@clerk/nextjs'
import LayoutProvider from "@/providers/layout-provider";

export const metadata: Metadata = {
  title: "Chatster",
  description: "Real time chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider >
  );
}
