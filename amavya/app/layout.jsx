import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LangProvider from "@/components/LangProvider";
import IntroGate from "@/components/IntroGate";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

const SITE_URL = "https://amavya.cloud";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AMAVYA — L'intelligence artificielle au service des entreprises modernes",
    template: "%s · AMAVYA",
  },
  description:
    "AMAVYA développe des solutions IA, SaaS et automatisations intelligentes pour transformer la prospection, la gestion et la productivité des entreprises.",
  keywords: [
    "AMAVYA",
    "intelligence artificielle",
    "agents IA",
    "CRM intelligent",
    "automatisation",
    "SaaS",
    "prospection automatisée",
    "business development",
    "Tarek Bouhlel",
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
    url: SITE_URL,
    siteName: "AMAVYA",
    title: "AMAVYA — L'intelligence artificielle au service des entreprises modernes",
    description:
      "Solutions IA, SaaS et automatisations intelligentes pour transformer la prospection, la gestion et la productivité.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "AMAVYA — IA, SaaS & automatisations intelligentes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMAVYA — IA, SaaS & automatisations intelligentes",
    description:
      "Agents IA autonomes, CRM intelligents et automatisations métiers pour les entreprises modernes.",
    creator: "@amavya",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMAVYA",
  url: SITE_URL,
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
  knowsAbout: [
    "Intelligence artificielle",
    "Automatisation",
    "SaaS",
    "CRM",
    "Agents IA",
    "Prospection intelligente",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only sr-only-focusable z-[200] rounded-full bg-gold-bright px-4 py-2 text-sm font-semibold text-ink shadow-[0_8px_30px_-8px_rgba(212,175,55,0.7)]"
          style={{ left: "1rem", top: "1rem" }}
        >
          Aller au contenu
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <LangProvider>
          {children}
          <IntroGate />
        </LangProvider>
      </body>
    </html>
  );
}
