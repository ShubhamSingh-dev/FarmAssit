import type React from "react";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { AuthProvider } from "@/components/auth-provider";
import { LanguageProvider } from "@/components/language-provider"; // Import LanguageProvider
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FarmAssist - AI-Powered Farming Solutions",
  description: "Your digital companion for smart farming",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {" "}
            {/* Wrap the entire app in LanguageProvider */}
            <Providers
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
              storageKey="farmassist-theme"
            >
              {children}
            </Providers>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
