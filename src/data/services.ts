import bathroomImg from "@/assets/services/bathroom.jpg";
import kitchenImg from "@/assets/services/kitchen.jpg";
import extensionImg from "@/assets/services/extension.jpg";
import roofImg from "@/assets/services/roof.jpg";
import flooringImg from "@/assets/services/flooring.jpg";
import solarImg from "@/assets/services/solar.jpg";
import interiorImg from "@/assets/services/interior.jpg";
import electricalImg from "@/assets/services/electrical.jpg";
import basementImg from "@/assets/services/basement.jpg";
import securityImg from "@/assets/services/security.jpg";
import plumbingImg from "@/assets/services/plumbing.jpg";
import treeImg from "@/assets/services/tree.jpg";

export const SERVICE_CATEGORIES = [
  "All",
  "Interior",
  "Exterior",
  "Structural",
  "Energy",
  "Tech",
  "Systems",
] as const;

export type ServiceCategoryFilter = (typeof SERVICE_CATEGORIES)[number];

export type ServiceCategory = Exclude<ServiceCategoryFilter, "All">;

export interface ServiceItem {
  image: string;
  title: string;
  desc: string;
  category: ServiceCategory;
  keywords: string[];
  bentoSpan?: string;
}

export const SERVICES: ServiceItem[] = [
  {
    image: kitchenImg,
    title: "Kitchen Remodels",
    desc: "Cabinetry, countertops, appliances, and electrical work.",
    category: "Interior",
    keywords: ["kitchen", "remodel", "cabinet"],
    bentoSpan: "lg:col-span-6 lg:row-span-2",
  },
  {
    image: bathroomImg,
    title: "Bathroom Renovations",
    desc: "Full redesigns, plumbing, tiling, and fixtures.",
    category: "Interior",
    keywords: ["bathroom", "renovation", "tiling"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: extensionImg,
    title: "Home Extensions",
    desc: "Adding rooms, structural work, and finishing.",
    category: "Structural",
    keywords: ["extension", "extend", "new build", "build"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: roofImg,
    title: "Roof Replacements & Repairs",
    desc: "Complete roof systems, gutters, and skylights.",
    category: "Exterior",
    keywords: ["roof", "roofing", "gutter"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: flooringImg,
    title: "Flooring Upgrades",
    desc: "Hardwood, luxury vinyl, tiles, and custom installations.",
    category: "Interior",
    keywords: ["flooring", "floor", "vinyl", "hardwood"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: solarImg,
    title: "Solar Panels",
    desc: "Solar panel installation, maintenance, and energy systems.",
    category: "Energy",
    keywords: ["solar", "panel", "energy"],
    bentoSpan: "lg:col-span-4",
  },
  {
    image: interiorImg,
    title: "Decorators",
    desc: "Painting, plastering, wallpapering, and finishing touches.",
    category: "Interior",
    keywords: ["decorator", "paint", "interior", "garden"],
    bentoSpan: "lg:col-span-4",
  },
  {
    image: electricalImg,
    title: "Full Electrical Rewire",
    desc: "Complete rewiring, fuse boards, sockets, and certified electrical work.",
    category: "Systems",
    keywords: ["electrical", "rewire", "electric"],
    bentoSpan: "lg:col-span-4",
  },
  {
    image: basementImg,
    title: "Basement Conversions",
    desc: "Structural work, plumbing, electrical, and finishing.",
    category: "Structural",
    keywords: ["basement", "conversion", "cellar"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: securityImg,
    title: "Security & Smart Home",
    desc: "Modern security systems and smart home technology.",
    category: "Tech",
    keywords: ["security", "smart home", "alarm"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: plumbingImg,
    title: "New Plumbing Systems",
    desc: "Full installations for water, heating, and drainage.",
    category: "Systems",
    keywords: ["plumbing", "heating", "boiler", "pipe"],
    bentoSpan: "lg:col-span-3",
  },
  {
    image: treeImg,
    title: "Tree Surgery",
    desc: "Tree removal, pruning, and safety management.",
    category: "Exterior",
    keywords: ["tree", "garden", "arborist"],
    bentoSpan: "lg:col-span-3",
  },
];

export const QUICK_SEARCH_CHIPS = [
  "Kitchen",
  "Bathroom",
  "Extension",
  "Loft",
  "Roofing",
  "New Build",
  "Plumbing",
  "Electrical",
  "Garden",
  "Other",
] as const;

/** Maps hero quick chips to service titles used in /get-quotes?projects= */
export const QUOTE_PROJECT_TYPES = [
  "Full Home Renovation",
  "Kitchen Fitting",
  "Bathroom Renovation",
  "Extension / Loft Conversion",
  "Basement Conversion",
  "Electrical Work",
  "Plumbing",
  "Painting & Decorating",
  "Roofing",
  "Flooring",
  "Solar Panel Installation",
  "Garden / Landscaping",
  "Tree Surgery",
  "Security & Smart Home",
  "General Repairs",
  "Other",
] as const;

/** Maps service card / URL ?projects= titles to get-quotes form dropdown values */
export const SERVICE_TO_QUOTE_PROJECT: Record<string, string> = {
  "Kitchen Remodels": "Kitchen Fitting",
  "Bathroom Renovations": "Bathroom Renovation",
  "Home Extensions": "Extension / Loft Conversion",
  "Basement Conversions": "Basement Conversion",
  "Roof Replacements & Repairs": "Roofing",
  "Roof Repairs & Replacements": "Roofing",
  "Flooring Upgrades": "Flooring",
  "Solar Panels": "Solar Panel Installation",
  "Solar Panel Installation": "Solar Panel Installation",
  "Full Interior Renovations": "Full Home Renovation",
  "Decorators": "Painting & Decorating",
  "Outdoor Landscaping & Hardscaping": "Garden / Landscaping",
  "Full Electrical Rewire": "Electrical Work",
  "Electrical Rewiring": "Electrical Work",
  "Security & Smart Home": "Security & Smart Home",
  "Security & Smart Home Installations": "Security & Smart Home",
  "New Plumbing Systems": "Plumbing",
  "Plumbing & Heating Systems": "Plumbing",
  "Tree Surgery": "Tree Surgery",
  "Tree Surgery & Arborist": "Tree Surgery",
  "Tree Surgery & Arborist Services": "Tree Surgery",
  Other: "Other",
};

export function mapServiceToQuoteProject(serviceName: string): string {
  const mapped = SERVICE_TO_QUOTE_PROJECT[serviceName];
  if (mapped) return mapped;
  if ((QUOTE_PROJECT_TYPES as readonly string[]).includes(serviceName)) return serviceName;
  return "Other";
}

export const CHIP_TO_PROJECT: Record<string, string> = {
  Kitchen: "Kitchen Remodels",
  Bathroom: "Bathroom Renovations",
  Extension: "Home Extensions",
  Loft: "Home Extensions",
  Roofing: "Roof Replacements & Repairs",
  "New Build": "Home Extensions",
  Plumbing: "New Plumbing Systems",
  Electrical: "Full Electrical Rewire",
  Garden: "Tree Surgery",
  Other: "Other",
};

export type HeroSearchSuggestion = {
  label: string;
  value: string;
};

/** Suggestions for hero search (chips + matching services) */
export function getHeroSearchSuggestions(query: string): HeroSearchSuggestion[] {
  const q = query.trim().toLowerCase();
  const seen = new Set<string>();
  const results: HeroSearchSuggestion[] = [];

  for (const chip of QUICK_SEARCH_CHIPS) {
    if (!q || chip.toLowerCase().includes(q)) {
      seen.add(chip.toLowerCase());
      results.push({ label: chip, value: chip });
    }
  }

  if (!q) {
    return results;
  }

  for (const service of SERVICES) {
    if (results.length >= 10) break;
    const matches =
      service.title.toLowerCase().includes(q) ||
      service.keywords.some((k) => k.includes(q));
    if (!matches) continue;
    const key = service.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ label: service.title, value: service.title });
  }

  return results.slice(0, 10);
}

export function resolveProjectFromQuery(query: string): string | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const chipKey = Object.keys(CHIP_TO_PROJECT).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase(),
  );
  if (chipKey) return CHIP_TO_PROJECT[chipKey];

  const matches = filterServices(SERVICES, trimmed, "All");
  if (matches.length > 0) return matches[0].title;

  return trimmed;
}

export function filterServices(
  services: ServiceItem[],
  query: string,
  category: ServiceCategoryFilter,
): ServiceItem[] {
  const q = query.trim().toLowerCase();

  return services.filter((s) => {
    const matchCategory = category === "All" || s.category === category;
    if (!matchCategory) return false;
    if (!q) return true;

    return (
      s.title.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q))
    );
  });
}
