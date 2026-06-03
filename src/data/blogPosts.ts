import kitchenBudget from "@/assets/blog/kitchen-budget.jpg";
import vettingTradespeople from "@/assets/blog/vetting-tradespeople.jpg";
import loftConversion from "@/assets/blog/loft-conversion.jpg";
import bathroomMistakes from "@/assets/blog/bathroom-mistakes.jpg";
import extensionCost from "@/assets/blog/extension-cost.jpg";
import multiTrade from "@/assets/blog/multi-trade.jpg";

export type BlogSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  image: string;
  imageAlt: string;
  author: string;
  metaDescription: string;
  keywords: string[];
  sections: BlogSection[];
  tag?: string;
};

export const CATEGORIES = ["All", "Renovations", "Trade Tips", "Home Improvement", "Project Planning", "Industry News"] as const;

export const POSTS: BlogPost[] = [
  {
    slug: "kitchen-renovation-budget-guide",
    title: "How to budget for a kitchen renovation in 2026",
    excerpt: "From cabinets to countertops — here's what UK homeowners are really paying right now, and where you can save without cutting corners.",
    category: "Renovations",
    date: "2026-04-18",
    readMins: 8,
    image: kitchenBudget,
    imageAlt: "Modern white shaker UK kitchen with marble countertops",
    author: "Complete My Project Editorial",
    tag: "Featured",
    metaDescription: "A realistic 2026 UK kitchen renovation budget guide: average costs by tier, where to splurge, where to save, and how to avoid the most common overspends.",
    keywords: ["kitchen renovation cost UK", "kitchen renovation budget 2026", "new kitchen price"],
    sections: [
      { type: "p", text: "A new kitchen is usually the single biggest improvement a UK homeowner will make to their property — and it's also the easiest place to overspend. In 2026, with material costs stabilising but labour rates still climbing, planning your budget carefully is more important than ever." },
      { type: "h2", text: "Average kitchen renovation costs in 2026" },
      { type: "p", text: "Based on 600+ projects we've helped match this year, here's what UK homeowners are typically paying for a full kitchen renovation, including labour, materials, and VAT:" },
      { type: "ul", items: [
        "Budget tier (flat-pack, laminate worktop, basic appliances): £8,000–£14,000",
        "Mid-range (rigid-built units, quartz worktop, integrated appliances): £18,000–£28,000",
        "Premium (handmade cabinets, stone worktop, designer appliances): £35,000–£60,000+",
      ]},
      { type: "h2", text: "Where to spend, where to save" },
      { type: "h3", text: "Worth the splurge" },
      { type: "ul", items: [
        "Worktops — daily wear and tear means quartz or granite usually outlasts laminate by 15+ years.",
        "Cabinet carcasses — rigid (pre-built) carcasses hold up far better than flat-pack over time.",
        "Extraction — a poor extractor will haunt you with grease and condensation problems.",
      ]},
      { type: "h3", text: "Easy savings" },
      { type: "ul", items: [
        "Cabinet doors — keep the same carcasses but swap the doors for a fresh look at a fraction of the cost.",
        "Tiles — high-street ranges now rival designer brands for quality.",
        "Lighting — IKEA and Screwfix LED strips look identical to spec-brand alternatives.",
      ]},
      { type: "h2", text: "The hidden costs nobody tells you about" },
      { type: "p", text: "It's rarely the kitchen itself that breaks the budget — it's everything around it. Plan a 15–20% contingency for these:" },
      { type: "ul", items: [
        "Replastering after units are removed (£800–£1,500)",
        "Electrical rewiring for new appliance positions (£600–£2,000)",
        "Flooring continuation into adjoining rooms (£1,200–£3,500)",
        "Decoration of the kitchen and any opened-up spaces (£900–£2,200)",
      ]},
      { type: "quote", text: "The clients who stay on budget are the ones who decide on the entire scope before a single cabinet is ordered — not the ones who chase the lowest quote." },
      { type: "h2", text: "How to get accurate quotes" },
      { type: "p", text: "Generic 'per metre' kitchen prices are useless. To get an accurate quote, share these details with any company you're considering: room dimensions, current layout drawings, photos of all four walls, your appliance wishlist, your worktop preference, and your floor type. The more detail you give upfront, the less likely you are to face mid-project price hikes." },
      { type: "p", text: "If you'd like to compare two vetted multi-trade companies who can quote and deliver the entire project end-to-end, request a free match in under two minutes." },
    ],
  },
  {
    slug: "vetting-tradespeople-checklist",
    title: "10 questions you should ask before hiring any tradesperson",
    excerpt: "Insurance, references, certifications — the checklist that separates the professionals from the cowboys.",
    category: "Trade Tips",
    date: "2026-04-12",
    readMins: 6,
    image: vettingTradespeople,
    imageAlt: "Professional UK tradesperson shaking hands with a homeowner",
    author: "Complete My Project Editorial",
    metaDescription: "Use this 10-question checklist to vet any UK tradesperson before signing a contract — covering insurance, references, certifications, payment terms, and more.",
    keywords: ["how to vet a tradesperson UK", "questions to ask a builder", "hire a tradesperson"],
    sections: [
      { type: "p", text: "The difference between a brilliant renovation and a nightmare is almost always who you hired — not what you hired them to do. Use this checklist on every quote conversation." },
      { type: "h2", text: "The 10 questions to ask" },
      { type: "h3", text: "1. Are you fully insured?" },
      { type: "p", text: "Ask for proof of public liability insurance (minimum £2 million for residential work). A serious professional carries the certificate on their phone." },
      { type: "h3", text: "2. Can I speak to two recent customers?" },
      { type: "p", text: "Not testimonials — actual phone numbers. Ask the references about communication, cleanliness, and how problems were handled." },
      { type: "h3", text: "3. What certifications do you hold for this work?" },
      { type: "p", text: "Gas Safe for gas, NICEIC or NAPIT for electrics, FENSA or CERTASS for windows. No certificate, no work." },
      { type: "h3", text: "4. Will you provide a written, itemised quote?" },
      { type: "p", text: "Verbal estimates are not contracts. Insist on materials, labour, timescale, payment schedule, and what's NOT included." },
      { type: "h3", text: "5. What is your payment schedule?" },
      { type: "p", text: "Never pay more than 25% upfront. Stage payments tied to milestones (first fix, second fix, completion) protect both sides." },
      { type: "h3", text: "6. Who will actually be on site?" },
      { type: "p", text: "Many one-person companies subcontract. You deserve to know who's coming through your door." },
      { type: "h3", text: "7. What is your warranty period?" },
      { type: "p", text: "12 months on workmanship is the legal minimum. Better firms offer 2–6 years, often backed by an insurance-backed guarantee." },
      { type: "h3", text: "8. How will you protect my home?" },
      { type: "p", text: "Dust sheets, floor protection, daily clean-up — the answer reveals how respectfully they'll treat your property." },
      { type: "h3", text: "9. What happens if there's a problem after completion?" },
      { type: "p", text: "A clear complaints procedure and named contact tells you they've been here before — and stuck around for it." },
      { type: "h3", text: "10. Are you a member of any trade body?" },
      { type: "p", text: "TrustMark, FMB, or Checkatrade Approved provide an extra escalation route if things go wrong." },
      { type: "h2", text: "What good answers sound like" },
      { type: "p", text: "Confident, specific, and unrushed. If a tradesperson gets defensive about any of these questions, that's your answer." },
    ],
  },
  {
    slug: "loft-conversion-planning-permission",
    title: "Loft conversions: Do you really need planning permission?",
    excerpt: "Most loft conversions fall under permitted development — but there are crucial exceptions every UK homeowner should know.",
    category: "Project Planning",
    date: "2026-04-05",
    readMins: 7,
    image: loftConversion,
    imageAlt: "Beautiful UK loft conversion bedroom with skylights and exposed beams",
    author: "Complete My Project Editorial",
    metaDescription: "Loft conversion planning permission explained: when you don't need it, when you do, and how to use Permitted Development rights safely in 2026.",
    keywords: ["loft conversion planning permission", "permitted development loft", "do I need planning permission loft"],
    sections: [
      { type: "p", text: "The good news: around 80% of UK loft conversions can be built under Permitted Development (PD) rights, meaning no full planning application required. The bad news: the exceptions catch out a lot of homeowners — and breaching them can mean tearing the whole thing down." },
      { type: "h2", text: "When you DON'T need planning permission" },
      { type: "p", text: "Under Permitted Development you can usually convert your loft if all of the following apply:" },
      { type: "ul", items: [
        "The additional roof space is 40 m³ or less (terraced) or 50 m³ or less (semi/detached)",
        "No extension is forward of the front roof slope",
        "Materials are similar in appearance to the existing house",
        "No verandas, balconies, or raised platforms",
        "Side-facing windows are obscure-glazed and non-opening below 1.7 m",
        "The eaves are not raised by more than 150 mm (Hip-to-gable conversions are an exception)",
      ]},
      { type: "h2", text: "When you DO need planning permission" },
      { type: "ul", items: [
        "You live in a flat or maisonette — PD doesn't apply",
        "The property is in a designated area (Conservation Area, AONB, National Park)",
        "The property is listed (you'll also need Listed Building Consent)",
        "You exceed the volume allowance",
        "Your home has had previous extensions that used up the PD allowance",
        "Article 4 directions are in force in your local authority area",
      ]},
      { type: "h2", text: "What you'll always need: Building Regulations" },
      { type: "p", text: "Even under PD, every loft conversion requires Building Regulations approval. This covers structural integrity, fire safety (a protected stairwell is mandatory), thermal performance, and electrical safety. Budget £400–£900 for the application and inspection visits." },
      { type: "h2", text: "Party Wall Act (semi-detached and terraced)" },
      { type: "p", text: "If you share a wall with a neighbour, you'll need to serve a Party Wall Notice at least two months before work starts. If your neighbour dissents, a Party Wall Surveyor is appointed (typically £900–£1,500)." },
      { type: "quote", text: "Apply for a Lawful Development Certificate before you start. It costs around £103 and gives you legal certainty that your conversion is permitted — invaluable when you sell." },
      { type: "h2", text: "The realistic timeline" },
      { type: "ul", items: [
        "Design and structural calculations: 2–4 weeks",
        "Lawful Development Certificate (recommended): 8 weeks",
        "Party Wall notices (if required): 2 months",
        "Build: 6–10 weeks for a standard dormer",
      ]},
      { type: "p", text: "Plan for 4–6 months from concept to keys, and you'll have a stress-free project." },
    ],
  },
  {
    slug: "bathroom-renovation-mistakes",
    title: "5 bathroom renovation mistakes that will haunt you",
    excerpt: "Cheap fittings, wrong waterproofing, and bad ventilation top the list. Avoid these and you'll thank yourself later.",
    category: "Home Improvement",
    date: "2026-03-28",
    readMins: 5,
    image: bathroomMistakes,
    imageAlt: "Modern UK bathroom with freestanding bath and brass fixtures",
    author: "Complete My Project Editorial",
    metaDescription: "The 5 most expensive bathroom renovation mistakes UK homeowners make — and exactly how to avoid them. Tanking, ventilation, layout, and more.",
    keywords: ["bathroom renovation mistakes", "bathroom renovation tips UK", "common bathroom problems"],
    sections: [
      { type: "p", text: "Bathrooms are unforgiving. Get the waterproofing wrong and you'll discover it through your kitchen ceiling. Get the ventilation wrong and mould will return every winter. Here are the five mistakes we see again and again." },
      { type: "h2", text: "1. Skipping proper tanking" },
      { type: "p", text: "Standard plasterboard behind tiles in a wet area is a disaster waiting to happen. Wet rooms and walk-in showers must be tanked with a liquid membrane and seal tape at every joint and pipe penetration. Cost: £300–£600 extra. Cost of getting it wrong: £4,000+ to strip out and redo." },
      { type: "h2", text: "2. Under-spec'ing the extractor fan" },
      { type: "p", text: "A £15 builder's-merchant fan can't shift the moisture from a daily shower. You need a fan rated for the room volume (typically 15 l/s minimum), with a humidity sensor and overrun timer. Budget £80–£180 for the fan, more if ducting needs replacing." },
      { type: "h2", text: "3. Choosing the wrong floor for the layout" },
      { type: "p", text: "Large-format tiles look amazing but won't sit flat on a sloping joisted floor without significant preparation. Vinyl is forgiving and waterproof, but cheap LVT can lift around showers. Discuss the substrate with your fitter before choosing the finish." },
      { type: "h2", text: "4. Forgetting the second isolation valve" },
      { type: "p", text: "Every concealed cistern, every shower mixer, every basin tap should have an accessible isolation valve. The £3 part saves a £200 plumber call-out the day a washer fails." },
      { type: "h2", text: "5. Boxing in the soil pipe permanently" },
      { type: "p", text: "Beautiful joinery hiding the soil stack feels like a clever idea — until the rodding eye is needed. Always include a removable access panel." },
      { type: "quote", text: "A good bathroom isn't the one that looks best on day one — it's the one that still looks great after five years of daily use." },
      { type: "h2", text: "Get it right first time" },
      { type: "p", text: "Every Complete My Project panel company is required to follow British Standard BS 8000 for installation, including proper tanking and ventilation specs. Compare two quotes from vetted firms in minutes." },
    ],
  },
  {
    slug: "extension-cost-2026",
    title: "How much does a house extension cost in 2026?",
    excerpt: "A realistic breakdown of single-storey, double-storey, and wrap-around extension costs across the UK.",
    category: "Renovations",
    date: "2026-03-20",
    readMins: 9,
    image: extensionCost,
    imageAlt: "Modern UK home with single-storey rear extension and bifold doors",
    author: "Complete My Project Editorial",
    metaDescription: "2026 UK house extension cost guide: average £/m² for single-storey, double-storey, side-return, and wrap-around extensions, plus hidden costs to plan for.",
    keywords: ["house extension cost UK 2026", "single storey extension cost", "extension price per square metre"],
    sections: [
      { type: "p", text: "Extensions are the surest way to add both space and value to a UK home — but they're also where homeowners get the biggest cost shocks. Here are the realistic numbers for 2026, broken down by extension type and region." },
      { type: "h2", text: "Average cost per m² (build only, no fit-out)" },
      { type: "ul", items: [
        "Single-storey rear extension: £1,800–£2,600/m²",
        "Double-storey extension: £1,600–£2,400/m² (cheaper per m² because foundations and roof are amortised)",
        "Side-return / wrap-around: £2,200–£3,200/m² (more complex roof and structural work)",
        "Add £300–£500/m² for London and the South East",
      ]},
      { type: "h2", text: "What that includes" },
      { type: "ul", items: [
        "Foundations, structural shell, roof, windows and doors",
        "First-fix electrics and plumbing",
        "Plastering ready for decoration",
      ]},
      { type: "h2", text: "What that DOESN'T include" },
      { type: "ul", items: [
        "Kitchen or bathroom fit-out (£8,000–£40,000+)",
        "Flooring (£40–£120/m² supplied and fitted)",
        "Decoration (£900–£2,500)",
        "Landscaping and patio reinstatement (£1,500–£6,000)",
        "Architect and structural engineer fees (typically 7–12% of build cost)",
        "Building Regs and planning fees (£500–£2,500)",
        "Party Wall surveyor (£900–£1,500 if neighbours dissent)",
      ]},
      { type: "h2", text: "Worked example: 30 m² rear extension in the Midlands" },
      { type: "ul", items: [
        "Build cost (£2,200/m²): £66,000",
        "Architect & structural eng. (10%): £6,600",
        "Kitchen and fit-out: £20,000",
        "Flooring and decoration: £4,500",
        "Fees and contingencies (12%): £11,500",
        "Total: ~£108,600",
      ]},
      { type: "h2", text: "How to keep costs predictable" },
      { type: "ul", items: [
        "Lock the design before tendering — change orders mid-build are the #1 cause of overspend.",
        "Use a fixed-price contract, not 'cost-plus'.",
        "Keep the kitchen layout aligned with existing drainage where possible.",
        "Choose stock-size windows and doors over bespoke.",
      ]},
      { type: "p", text: "Multi-trade companies on our panel deliver the entire project under one fixed price — design, build, and fit-out — eliminating the gaps where costs usually creep in." },
    ],
  },
  {
    slug: "multi-trade-vs-individual",
    title: "Multi-trade company vs hiring individual trades: which wins?",
    excerpt: "We weigh up cost, time, and stress — and the answer might surprise you.",
    category: "Industry News",
    date: "2026-03-14",
    readMins: 6,
    image: multiTrade,
    imageAlt: "Team of professional UK tradespeople collaborating around plans on a construction site",
    author: "Complete My Project Editorial",
    metaDescription: "Should you hire a multi-trade company or individual trades for your UK renovation? Honest breakdown of cost, timeline, accountability, and stress.",
    keywords: ["multi-trade company vs individual trades", "main contractor vs subcontractors", "renovation project management"],
    sections: [
      { type: "p", text: "It's the question every homeowner asks: do I save money by hiring trades individually, or pay a multi-trade company to coordinate the whole job? The honest answer depends on three things: scope, your time, and your tolerance for project management." },
      { type: "h2", text: "Hiring individual trades" },
      { type: "h3", text: "Pros" },
      { type: "ul", items: [
        "Can be 10–20% cheaper on labour for small, single-trade jobs",
        "Direct control over who you hire for each task",
        "Easier to swap people out mid-project",
      ]},
      { type: "h3", text: "Cons" },
      { type: "ul", items: [
        "You become the project manager — chasing schedules, sequencing trades, resolving disputes",
        "When something goes wrong, every trade blames the other",
        "Materials procurement falls on you (or attracts a markup from each trade)",
        "Insurance gaps between trades are common",
      ]},
      { type: "h2", text: "Hiring a multi-trade company" },
      { type: "h3", text: "Pros" },
      { type: "ul", items: [
        "One contract, one point of contact, one accountable party",
        "Properly sequenced trades = much faster completion",
        "Bulk material purchasing reduces costs",
        "Single insurance and warranty covering the entire project",
      ]},
      { type: "h3", text: "Cons" },
      { type: "ul", items: [
        "Typically 8–15% more expensive on paper for small jobs",
        "Less direct relationship with the people doing the work",
      ]},
      { type: "h2", text: "When each option wins" },
      { type: "p", text: "For a single-trade job (one room repaint, a boiler swap, a fence replacement) — hire individual trades. The coordination overhead isn't worth it." },
      { type: "p", text: "For anything involving 3+ trades (kitchens, bathrooms, extensions, full renovations) — a multi-trade company almost always works out cheaper once you account for the lost time, delays, and rework that come with self-managing." },
      { type: "quote", text: "We've seen homeowners 'save' £3,000 on labour and lose £8,000 to delays, snagging, and finger-pointing. The cheapest hour is the one you didn't have to spend chasing." },
      { type: "h2", text: "How Complete My Project helps" },
      { type: "p", text: "Every company on our panel is a multi-trade specialist that has passed our 6-Point Gold Standard vetting. You get one quote, one contract, and one team accountable for the whole project — no more chasing." },
    ],
  },
];

export const getPostBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
export const getRelatedPosts = (slug: string, count = 3) =>
  POSTS.filter((p) => p.slug !== slug).slice(0, count);
