const faviconAnySize = `${'an'}y`;

export function getRootMetadata() {
  return {
    title: {
      default: "DATAKWABA",
      template: "%s | DATAKWABA",
    },
    description:
      "✨ DATAKWABA",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.datakwaba.com"),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "/",
      siteName: "DATAKWABA",
      title: "DATAKWABA",
      description:
        "🔮   DATAKWABA",
      images: [
        { url: "/og-image.jpg", width: 1200, height: 630, alt: "DATAKWABA", type: "image/jpeg" },
        { url: "/og-image-square.jpg", width: 800, height: 800, alt: "DATAKWABA Logo", type: "image/jpeg" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@DatakwabaApp",
      creator: "@DatakwabaApp",
      title: "DATAKWABA ✨  ",
      description: "🔮 DATAKWABA",
      images: ["/twitter-image.jpg"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: faviconAnySize },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#8b5cf6" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: { capable: true, title: "DATAKWABA", statusBarStyle: "black-translucent" as const },
    other: { "mobile-web-app-capable": "yes", "apple-mobile-web-app-capable": "yes" },
  };
}