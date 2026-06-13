import { getRootMetadata } from "@/lib/layout/rootMetadata";
import { rootViewport } from "@/lib/layout/rootViewport";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { memo } from "react";
import { Providers, RootPortals, RootSkipLink } from "./providers";
import "./globals.css";

// ============================================================================
// CONSTANTES & CONFIGURATION
// ============================================================================

const SITE_CONFIG = {
  name: "DATAKWABA",
  url: "https://www.datakwaba.com",
  description: "✨ Découvrez votre destinée avec Mon DATAKWABA : consultations de guidance authentiques, analyses astrologiques personnalisées, numérologie avancée et guidance spirituelle par des experts certifiés. Révélez votre potentiel cosmique dès maintenant",
  twitterHandle: "@MonEtoileApp",
  ogImage: "/logo.png",
  ogImageAlt: "DATAKWABA",
  ogImageWidth: 512,
  ogImageHeight: 512,
} as const;

// ============================================================================
// FONTS
// ============================================================================

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "700"],
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// ============================================================================
// COMPOSANTS MÉMOÏSÉS POUR LES MÉTA-DONNÉES
// ============================================================================

const RootHeadMeta = memo(function RootHeadMeta() {
  return (
    <>
      {/* PWA / Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={SITE_CONFIG.name} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={`${SITE_CONFIG.name} — Votre Guide Spirituel`} />
      <meta property="og:description" content={SITE_CONFIG.description} />
      <meta property="og:url" content={SITE_CONFIG.url} />
      <meta property="og:image" content={SITE_CONFIG.ogImage} />
      <meta property="og:image:alt" content={SITE_CONFIG.ogImageAlt} />
      <meta property="og:image:width" content={SITE_CONFIG.ogImageWidth.toString()} />
      <meta property="og:image:height" content={SITE_CONFIG.ogImageHeight.toString()} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={`${SITE_CONFIG.name} — Votre Guide Spirituel`} />
      <meta name="twitter:description" content={SITE_CONFIG.description} />
      <meta name="twitter:image" content={SITE_CONFIG.ogImage} />
      <meta name="twitter:image:alt" content={SITE_CONFIG.ogImageAlt} />
    </>
  );
});

RootHeadMeta.displayName = 'RootHeadMeta';

// ============================================================================
// SCRIPTS OPTIMISÉS
// ============================================================================

const ThemeScript = memo(function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('monetoile-theme') || localStorage.getItem('theme') || 'light';
              const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              const root = document.documentElement;
              if (isDark) {
                root.classList.add('dark');
                root.style.colorScheme = 'dark';
              } else {
                root.classList.remove('dark');
                root.style.colorScheme = 'light';
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
});

ThemeScript.displayName = 'ThemeScript';

const SchemaScript = memo(function SchemaScript() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: "Plateforme pour guidance, astrologie, numérologie et guidance personnalisée",
        inLanguage: "fr-FR",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: { "@type": "ImageObject", url: `${SITE_CONFIG.url}/logo.png`, width: 512, height: 512 },
        sameAs: [
          "https://twitter.com/MonEtoileApp",
          "https://www.facebook.com/monetoile",
          "https://www.instagram.com/monetoile",
        ],
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", availableLanguage: ["French", "English"] },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_CONFIG.url}/#webpage`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} - Votre Guide Spirituel`,
        description: SITE_CONFIG.description,
        isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
        about: { "@id": `${SITE_CONFIG.url}/#organization` },
        inLanguage: "fr-FR",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
});

SchemaScript.displayName = 'SchemaScript';

// ============================================================================
// COMPOSANT PRINCIPAL LAYOUT
// ============================================================================

const RootMain = memo(function RootMain({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="relative" role="main" aria-label="DATAKWABA">
      {children}
    </main>
  );
});

RootMain.displayName = 'RootMain';

export const metadata: Metadata = getRootMetadata();
export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyClasses = `${inter.className} theme-dark-shell antialiased bg-white text-gray-900 dark:bg-gradient-to-b dark:from-[#0C0B1D] dark:to-[#162A56] dark:text-[color:var(--theme-text-main)]
    selection:bg-blue-500/20 dark:selection:bg-[#4F83D1]/35 selection:text-blue-950 dark:selection:text-white`;

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="PCmMbQ0ApvUt3F0pWO_nK13s9TejmbC0dSxyjK4WBR8" />
        <RootHeadMeta />
        <ThemeScript />
        <SchemaScript />
      </head>

      <body className={bodyClasses} suppressHydrationWarning>
        <RootSkipLink />
        <Providers>
          <RootMain>{children}</RootMain>
        </Providers>
        <RootPortals />
      </body>
    </html>
  );
}