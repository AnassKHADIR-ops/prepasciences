import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050B1D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://prepasciences.ma"),
  title: "Prépasciences | Plateforme d'Élite pour Étudiants en CPGE",
  description:
    "Accompagnement hebdomadaire d'excellence en Mathématiques et Physique-Chimie avec deux professeurs agrégés d'État en CPGE au Maroc (TSI 2e, MP/MP* 2e, CNC & concours français).",
  keywords: [
    "CPGE Maroc",
    "Concours National Commun",
    "CNC 2026",
    "Maths CPGE",
    "Physique CPGE",
    "Professeur Agrégé",
    "TSI 2",
    "MP MP*",
  ],
  authors: [{ name: "Prépasciences" }],
  openGraph: {
    title: "Prépasciences | L'Excellence en CPGE Scientifique",
    description:
      "Encadrement d'élite en Mathématiques et Physique-Chimie pour transformer vos révisions en réussite aux concours CPGE.",
    url: "https://prepasciences.ma",
    siteName: "Prépasciences CPGE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Prépasciences | L'Excellence en CPGE Scientifique",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prépasciences | L'Excellence en CPGE Scientifique",
    description:
      "Encadrement d'élite en Mathématiques et Physique-Chimie pour CPGE TSI & MP/MP*.",
    images: ["/og-image.jpg"],
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
    >
      <head>
        {/* Critical LCP Frame Preload */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/frames/frame_001.webp"
          fetchPriority="high"
        />
        {/* Preconnect to WhatsApp for instant CTA response */}
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />

        {/* PWA Manifest & Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Synchronous scroll restoration kill switch & bfcache resurrect */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
              } catch(e) {}
              window.addEventListener('pageshow', function(e) {
                if (e.persisted) {
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#050B1D] text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
