import { Chakra_Petch, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { baseUrl, dictionary, htmlLang, pathFor, type Locale } from "@/content/locales";
import "@/app/globals.css";

const bodyFont = Hanken_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const monoFont = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });
const displayFont = Chakra_Petch({ subsets: ["latin"], weight: ["600","700"], display: "swap", variable: "--font-display" });
export const portfolioViewport = { themeColor: "#080b0d", colorScheme: "dark" } as const;

export function Document({ children, locale }: Readonly<{ children: React.ReactNode; locale: Locale }>) {
  const words = dictionary[locale];
  const person = { "@context": "https://schema.org", "@type": "Person", name: site.name, jobTitle: words.job, email: `mailto:${site.email}`, url: new URL(pathFor(locale), baseUrl).href, sameAs: [site.github, site.linkedin] };
  return <html lang={htmlLang[locale]} className={`${bodyFont.variable} ${monoFont.variable} ${displayFont.variable}`}>
    <body><a className="skip-link" href="#conteudo">{words.skip}</a>{children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
    </body>
  </html>;
}
