import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { baseMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/components/providers/theme-provider";

// Switzer Variable Font (Local)
const switzer = localFont({
  src: [
    {
      path: "./fonts/Switzer-Variable.woff2",
      style: "normal",
    },
    {
      path: "./fonts/Switzer-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});

/**
 * Root Layout Metadata
 * Uses baseMetadata from lib/metadata.ts for consistent site-wide SEO
 */
export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${switzer.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
