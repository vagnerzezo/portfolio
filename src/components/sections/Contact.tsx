import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/content/site";

/*
 * Fundo claro (bone). O destaque do título é só o itálico, em ink. (O accent atual, #0702FE,
 * teria 7:1 sobre bone e passaria no AA, caso se queira usá-lo aqui.)
 */
export function Contact() {
  const { email, socials } = site.contact;

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="on-light scroll-mt-20 bg-bone py-28 text-ink-900 md:py-40"
    >
      <div className="shell grid gap-16">
        <div className="grid gap-8">
          <SectionLabel index={7} className="text-ink-900/70!">
            Contato
          </SectionLabel>
          <h2 id="contato-title" className="font-display text-[clamp(3.25rem,9vw,8.5rem)] leading-[0.92] tracking-[-0.02em]">
            Vamos criar <em>algo juntos?</em>
          </h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="grid content-start gap-10 lg:col-span-4 lg:col-start-9">
            <div className="grid gap-3">
              <p className="font-mono text-xs tracking-[0.08em] text-ink-900/70 uppercase">E-mail</p>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-xl break-all underline-offset-4 hover:underline md:text-2xl">
                {email}
              </a>
            </div>
            <div className="grid gap-3">
              <p className="font-mono text-xs tracking-[0.08em] text-ink-900/70 uppercase">Redes</p>
              <ul className="grid">
                {socials.map((social) => (
                  <li key={social.label} className="border-b border-ink-900/15">
                    <ArrowLink href={social.href} external className="w-full justify-between py-2 text-lg">
                      {social.label}
                    </ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
