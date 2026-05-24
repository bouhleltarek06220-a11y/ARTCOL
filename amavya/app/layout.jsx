import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://amavya.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AMAVYA — L'intelligence artificielle au service des entreprises modernes",
    template: "%s · AMAVYA",
  },
  description:
    "AMAVYA développe des solutions IA, SaaS et automatisations intelligentes pour transformer la prospection, la gestion et la productivité des entreprises.",
  keywords: [
    "intelligence artificielle",
    "agents IA",
    "CRM intelligent",
    "automatisation",
    "SaaS",
    "prospection automatisée",
    "AMAVYA",
    "business development",
    "France",
  ],
  authors: [{ name: "Tarek Bouhlel" }],
  creator: "AMAVYA",
  publisher: "AMAVYA",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "AMAVYA",
    title: "AMAVYA — L'intelligence artificielle au service des entreprises modernes",
    description:
      "Agents IA autonomes, CRM intelligents et automatisations métiers pour travailler plus vite, mieux et avec plus d'impact.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMAVYA — Solutions IA pour entreprises modernes",
    description:
      "Agents IA, CRM intelligents et automatisations métiers conçus pour renforcer l'humain.",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  themeColor: "#05060c",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMAVYA",
  url: siteUrl,
  description:
    "SASU française spécialisée en intelligence artificielle, automatisation, SaaS, CRM et agents IA.",
  founder: {
    "@type": "Person",
    name: "Tarek Bouhlel",
  },
  foundingLocation: {
    "@type": "Country",
    name: "France",
  },
  areaServed: "FR",
  knowsAbout: [
    "Intelligence artificielle",
    "Agents IA",
    "CRM",
    "Automatisation",
    "SaaS",
    "Prospection intelligente",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
