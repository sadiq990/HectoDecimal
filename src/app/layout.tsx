import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { messages } from "@/messages/en";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} – Precision Hex & Number Base Converter`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#07080A" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      if (stored === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch (e) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-mesh min-h-screen flex flex-col font-sans">
        {/* Skip to Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
        >
          {messages.common.skipToContent}
        </a>

        {/* Noscript fallback notice */}
        <noscript>
          <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-center py-2 px-4 text-xs font-medium">
            {messages.common.noscriptNotice}
          </div>
        </noscript>

        <Header />

        <main id="main-content" className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
