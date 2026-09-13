import "./globals.css";
import { Providers } from "@/components/Providers";
import { ConditionalShell } from "@/components/ConditionalShell";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  icons: {
    icon: "/favicon.ico",
  },
  title: { default: "CCS - Core Computing Society | Student Computing Club", template: "%s | CCS - Core Computing Society" },
  description:
    "CCS (Core Computing Society) unites students in Software Engineering, AI, Cyber Security, Data Science, and beyond. Join our computing community for clubs, events, projects, and learning.",
  keywords: [
    "CCS",
    "Core Computing Society",
    "computing society",
    "student computing club",
    "software engineering club",
    "AI club",
    "cyber security club",
    "data science",
    "student organization",
    "computing students",
  ],
  openGraph: {
    title: "CCS - Core Computing Society",
    description:
      "The home of computing students. CCS brings together students in Software Engineering, AI, Cybersecurity, and more. Discover clubs, events, projects, and join our community.",
    type: "website",
    siteName: "CCS - Core Computing Society",
    url: "https://ccsuop.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CCS - Core Computing Society",
    description: "Join the computing community at CCS",
  },
  verification: {
    google: "gLmK3cT3uIcSNPqxn0m-d0AjQDs63_IWZPZZMtc4nrY",
  },
  canonical: "https://ccsuop.com",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const viewport = { width: "device-width", initialScale: 1 };

// JSON-LD Structured Data for Organization with Developer Information
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CCS - Core Computing Society",
  "alternateName": ["Core Computing Society", "CCS"],
  "url": "https://ccsuop.com",
  "description": "A student-led computing society uniting students in Software Engineering, AI, Cyber Security, and Data Science.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Information",
    "url": "https://ccsuop.com/contact"
  },
  "creator": [
    {
      "@type": "Person",
      "name": "Muhammad Musa",
      "jobTitle": "Developer"
    },
    {
      "@type": "Person",
      "name": "Usman Sethi",
      "jobTitle": "Developer"
    }
  ],\n  "sameAs": [\n    "https://www.facebook.com/ccsuop",\n    "https://www.instagram.com/ccsuop",\n    "https://twitter.com/ccsuop",\n    "https://linkedin.com/company/ccsuop"\n  ]\n};

export default function RootLayout({ children }) {
  return (
    /*
      suppressHydrationWarning: the anti-flash script below mutates `className`
      synchronously before React hydrates, which would otherwise cause a mismatch.
    */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Anti-flash theme script — runs synchronously before first paint.
          Default: light. Reads localStorage if a preference was saved.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var t=localStorage.getItem('ccs-theme')||'light';
  var r=t==='dark'?'dark':t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):'light';
  document.documentElement.classList.toggle('dark',r==='dark');
  document.documentElement.style.colorScheme=r;
}catch(e){}})();`,
          }}
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <link rel="canonical" href="https://ccsuop.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
        </Providers>
      </body>
    </html>
  );
}
