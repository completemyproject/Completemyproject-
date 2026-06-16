import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";

const navItems = [
  { label: "Our Story", to: "/our-story" },
  { label: "Services", to: "/services" },
  { label: "Partnerships", to: "/partnerships" },
  { label: "FAQ", to: "/faq" },
  { label: "Blog", to: "/blog" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
  { label: "Trade Login", to: "/trades-login" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-50/85 backdrop-blur-lg border-b border-warm-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0" aria-label="Complete My Project — home">
            <img
              src={logo}
              alt="Complete My Project"
              decoding="async"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative text-foreground/70 hover:text-foreground text-sm font-medium tracking-tight transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-accent after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side — Get a quote CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/get-quotes"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold bg-accent hover:bg-accent/90 text-accent-foreground transition-colors px-4 py-2 rounded-full"
            >
              Get a free quote
            </Link>
            <button
              className="lg:hidden text-foreground p-1.5 rounded-md hover:bg-warm-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-warm-50 border-t border-warm-200 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block text-foreground hover:text-accent text-base font-medium py-2.5 border-b border-warm-200/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/get-quotes"
            onClick={() => setOpen(false)}
            className="block text-center bg-accent text-accent-foreground font-semibold text-sm py-3 rounded-full mt-4 hover:bg-accent/90 transition-colors"
          >
            Get a free quote
          </Link>
        </div>
      )}
    </header>
  );
}
