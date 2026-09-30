import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { site } from "@/content/site";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fullName = `${site.name.first} ${site.name.last}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${fullName} — ${site.role}`,
    template: `%s — ${fullName}`,
  },
  description: site.description,
  authors: [{ name: fullName, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: fullName,
    title: `${fullName} — ${site.role}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${fullName} — ${site.role}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh">
        {/* Sem JavaScript não há quem tire o preloader da frente; então ele nem aparece. */}
        <noscript dangerouslySetInnerHTML={{ __html: "<style>[data-preloader]{display:none!important}</style>" }} />
        <a
          href="#conteudo"
          className="sr-only z-[110] rounded-full bg-bone px-5 py-3 text-ink-950 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Pular para o conteúdo
        </a>
        <SmoothScroll />
        <Preloader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
