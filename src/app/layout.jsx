import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "CCS — Core Computing Society", template: "%s | CCS" },
  description:
    "Core Computing Society unites students in Software Engineering, AI, Cyber Security, Data Science, and beyond — building, learning, and leading together.",
  keywords: ["computing society", "student club", "software engineering", "AI", "cyber security"],
  openGraph: {
    title: "CCS — Core Computing Society",
    description: "The home of computing students. Clubs, events, projects, and a real community.",
    type: "website",
    siteName: "Core Computing Society",
  },
  twitter: { card: "summary_large_image", title: "CCS — Core Computing Society" },
};

export const viewport = { width: "device-width", initialScale: 1 };

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
