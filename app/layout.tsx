import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const poppins = localFont({
  src: [
    { path: "./fonts/poppins-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/poppins-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

const cenura = localFont({
  src: "./fonts/cenura.otf",
  variable: "--font-cenura",
  display: "swap",
  weight: "400",
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thebuilderscamp.com"),
  title: {
    default: "The Builders Camp | Habilidades del Futuro para Jóvenes",
    template: "%s | The Builders Camp",
  },
  description:
    "The Builders Camp by HiveYoung es un bootcamp intensivo de 5 días para jóvenes de enseñanza media que quieren desarrollar las habilidades del futuro.",
  applicationName: "The Builders Camp by HiveYoung",
  authors: [{ name: "HiveYoung", url: "https://hiveyoung.org/" }],
  creator: "HiveYoung",
  publisher: "HiveYoung",
  keywords: [
    "bootcamp para jóvenes",
    "bootcamp estudiantes enseñanza media",
    "habilidades del futuro",
    "emprendimiento juvenil",
    "liderazgo juvenil",
    "The Builders Camp",
    "HiveYoung",
    "The Builders Camp by HiveYoung",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "/",
    siteName: "The Builders Camp by HiveYoung",
    title: "The Builders Camp | Habilidades del Futuro para Jóvenes",
    description:
      "Una iniciativa de HiveYoung: bootcamp intensivo de 5 días para jóvenes que quieren aprender, crear y desarrollar las habilidades del futuro.",
    images: [
      {
        url: "/hero/hero.webp",
        alt: "The Builders Camp, bootcamp intensivo para jóvenes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Builders Camp | Habilidades del Futuro para Jóvenes",
    description:
      "The Builders Camp by HiveYoung: aprende de expertos, trabaja en equipo y desarrolla las habilidades del futuro.",
    images: ["/hero/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://www.thebuilderscamp.com/#website",
      url: "https://www.thebuilderscamp.com/",
      name: "The Builders Camp",
      alternateName: [
        "The Builders Camp by HiveYoung",
        "The Builders Camp Chile",
      ],
      publisher: {
        "@id": "https://www.thebuilderscamp.com/#organization",
      },
      inLanguage: "es-CL",
    },
    {
      "@type": "Organization",
      "@id": "https://www.thebuilderscamp.com/#organization",
      name: "The Builders Camp",
      alternateName: "The Builders Camp by HiveYoung",
      url: "https://www.thebuilderscamp.com/",
      logo: "https://www.thebuilderscamp.com/logo-white.svg",
      parentOrganization: {
        "@type": "Organization",
        name: "HiveYoung",
        url: "https://hiveyoung.org/",
        sameAs: ["https://www.linkedin.com/company/hiveyoung/"],
      },
      sameAs: [
        "https://www.instagram.com/thebuilders.cl/",
        "https://www.linkedin.com/company/hiveyoung/",
      ],
    },
    {
      "@type": "Event",
      "@id": "https://www.thebuilderscamp.com/#event",
      name: "The Builders Camp 2026",
      description:
        "Bootcamp intensivo de 5 días para estudiantes de enseñanza media, enfocado en habilidades del futuro, trabajo en equipo y construcción de soluciones para desafíos reales.",
      url: "https://www.thebuilderscamp.com/",
      image: "https://www.thebuilderscamp.com/hero/hero.webp",
      startDate: "2026-12-14T09:00:00-03:00",
      endDate: "2026-12-18T18:00:00-03:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Pontificia Universidad Católica de Chile",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santiago",
          addressRegion: "Región Metropolitana",
          addressCountry: "CL",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "HiveYoung",
        url: "https://hiveyoung.org/",
      },
      offers: {
        "@type": "Offer",
        url: "https://www.thebuilderscamp.com/apply",
        price: "20000",
        priceCurrency: "CLP",
        availability: "https://schema.org/InStock",
      },
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full ${poppins.variable} ${cenura.variable}`}>
      <head>
        <link rel="preload" href="/hero/hero.webp" as="image" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        suppressHydrationWarning
        style={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
