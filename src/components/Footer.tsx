import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

const companyLinks = [
  { label: "Our Story", to: "/our-story" },
  { label: "Services", to: "/services" },
  { label: "Partnerships", to: "/partnerships" },
  { label: "FAQ", to: "/faq" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
  { label: "Blog", to: "/blog" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

const socials = [
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-warm-50">
      {/* Headline banner */}
      <div className="bg-white border-b border-warm-200 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/60 mb-4">
            Ready when you are
          </p>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.0] tracking-[-0.03em] mb-8 text-foreground">
            One Project. One Price. <span className="text-oak-600">Zero Stress.</span>
          </h2>
          <Link
            to="/get-quotes"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            Get a free quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <img
              src={logo}
              alt="completemyproject.co.uk"
              loading="lazy"
              decoding="async"
              className="h-12 w-auto object-contain mb-5 brightness-0 invert"
            />
            <p className="text-warm-50/70 text-sm leading-relaxed mb-6 max-w-sm">
              The UK's trusted introduction service connecting homeowners with vetted multi-trade companies. One price, one point of contact, complete peace of mind.
            </p>

            <ul className="space-y-3 text-sm text-warm-50/70">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-oak-500 shrink-0" />
                <a href="mailto:info@completemyproject.co.uk" className="hover:text-warm-50 transition-colors">
                  info@completemyproject.co.uk
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-oak-500 shrink-0" />
                <span>4 Railway Street, Huddersfield, HD1 1JP</span>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-warm-50 text-xs uppercase tracking-[0.18em] mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-warm-50/70 hover:text-oak-500 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="md:col-span-2">
            <h4 className="font-semibold text-warm-50 text-xs uppercase tracking-[0.18em] mb-5">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-warm-50/70 hover:text-oak-500 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-warm-50 text-xs uppercase tracking-[0.18em] mb-5">Stay in the loop</h4>
            <p className="text-warm-50/70 text-sm leading-relaxed mb-4">
              Renovation tips and industry insights, straight to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center bg-warm-50/5 border border-warm-50/15 rounded-full overflow-hidden focus-within:border-oak-500/60 transition-colors">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-2.5 bg-transparent text-sm text-warm-50 placeholder:text-warm-50/40 focus:outline-none"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-accent text-accent-foreground p-2.5 m-1 rounded-full hover:bg-accent/90 transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-warm-50/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-warm-50/50 text-xs">
          <p>© {new Date().getFullYear()} Complete My Project. All rights reserved. Registered in England & Wales.</p>
          <div className="flex items-center gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-warm-50/15 hover:border-oak-500 hover:text-oak-500 flex items-center justify-center text-warm-50/60 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
