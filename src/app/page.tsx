import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { TechMarquee } from "@/components/sections/TechMarquee";
import { site } from "@/content/site";

// Dados estruturados (schema.org/Person) para o Google entender de quem é o site.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: `${site.name.first} ${site.name.last}`,
  jobTitle: site.role,
  url: site.url,
  image: `${site.url}${site.avatar.src}`,
  knowsAbout: site.tech,
  sameAs: site.contact.socials.map((social) => social.href).filter((href) => href.startsWith("http") && !href.includes("[PLACEHOLDER]")),
};

export default function Home() {
  return (
    <>
      <Header />
      {/* z-10 + fundo opaco: o main passa por cima do footer sticky (efeito cortina). */}
      <main id="conteudo" tabIndex={-1} className="relative z-10 bg-ink-900 outline-none">
        <Hero />
        <TechMarquee />
        <About />
        <Projects />
        <Services />
        <Experience />
        <Education />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        // JSON.stringify não escapa "<"; o replace impede que um texto do conteúdo feche a tag <script>.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
