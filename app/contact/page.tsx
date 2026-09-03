import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Cellova Labs with order questions, research inquiries, or batch documentation requests.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />

      <div className="mt-8 grid gap-14 lg:grid-cols-2">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
            Contact
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Speak With Our Team
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate">
            Questions about an order, a research application, or batch
            documentation? Send us a message and the appropriate team will
            respond.
          </p>

          <dl className="mt-10 space-y-6 border-t border-line pt-8 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-silver">
                General & Order Support
              </dt>
              <dd className="mt-1.5 text-ink">
                <a href="mailto:info@cellovalabs.com" className="transition-colors hover:text-brand-deep">info@cellovalabs.com</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-[0.16em] text-silver">
                Response Time
              </dt>
              <dd className="mt-1.5 text-ink">
                We aim to respond within one to two business days.
              </dd>
            </div>
          </dl>

        </header>

        <div className="rounded-[10px] border border-line bg-mist p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
