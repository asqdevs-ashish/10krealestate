import Link from "next/link";
import { brand, conversion } from "@/data/brand";
import { getFlagship, portfolioSummary } from "@/data";
import { mailtoHref, telHref, whatsappUrl, buildWhatsAppMessage } from "@/lib/whatsapp";
import { Wordmark } from "@/components/ui/Wordmark";
import { Eyebrow } from "@/components/ui/Label";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Residences", href: "/#residences" },
      { label: "Experience", href: "/#experience" },
      { label: "Location", href: "/#location" },
    ],
  },
  {
    title: "Residences",
    links: [
      { label: "Availability", href: "/availability" },
      { label: "Floor plans", href: "/#floor-plan" },
      { label: "Investment outlook", href: "/#investment" },
      { label: "Schedule a viewing", href: "/book-a-viewing" },
    ],
  },
];

export function SiteFooter() {
  const project = getFlagship();
  const summary = portfolioSummary();
  const wa = whatsappUrl(buildWhatsAppMessage({ intent: "advisor" }));

  return (
    <footer id="site-footer" data-tone="light" className="relative border-t border-hair bg-paper-2">
      <div className="mx-auto w-full max-w-[110rem] px-6 pt-20 pb-32 md:px-10 md:py-28">
        <div className="grid gap-16 xl:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-8">
            <Wordmark size="lg" />
            <p className="max-w-[30ch] text-sm leading-relaxed text-dim">
              {brand.positioning} {summary.projects} addresses and {summary.residences} residences
              across Gurugram, with {project.name} now selling in {project.locality}.
            </p>
            {brand.social.some((item) => item.href) ? (
              <div className="flex flex-wrap gap-5">
                {brand.social
                  .filter((item) => item.href)
                  .map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="u-label text-text/55 transition-colors duration-500 hover:text-accent-2"
                    >
                      {item.label}
                    </a>
                  ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-5">
              <Eyebrow>{column.title}</Eyebrow>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text/70 transition-colors duration-500 hover:text-text"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col gap-5">
            <Eyebrow>Contact</Eyebrow>
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <a
                  href={telHref()}
                  className="flex flex-col gap-1 text-text/80 transition-colors duration-500 hover:text-accent-2"
                >
                  <span className="u-label text-faint">Phone</span>
                  <span className="u-num">{brand.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={mailtoHref(
                    `${project.name} — residence enquiry`,
                    `Hello, I would like more information about ${project.name}.`,
                  )}
                  className="flex flex-col gap-1 text-text/80 transition-colors duration-500 hover:text-accent-2"
                >
                  <span className="u-label text-faint">Email</span>
                  <span>{brand.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-1 text-text/80 transition-colors duration-500 hover:text-accent-2"
                >
                  <span className="u-label text-faint">WhatsApp</span>
                  <span>Message a property advisor</span>
                </a>
              </li>
              <li className="mt-2 flex flex-col gap-2 text-xs leading-relaxed text-dim">
                <span className="u-label text-faint">Experience centre</span>
                {brand.contact.siteOffice}
                <span>{brand.contact.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-hair pt-8 md:flex-row md:items-center md:justify-between">
          <p className="u-label text-faint">
            © {new Date().getFullYear()} {brand.name} · {conversion.disclaimer}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {brand.legal.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="u-label text-faint transition-colors duration-500 hover:text-text"
              >
                {item.label}
              </Link>
            ))}
            <a href="#top" className="u-label text-faint transition-colors duration-500 hover:text-text">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
