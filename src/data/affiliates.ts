import simplyLidLogo from "@/assets/Affiliates/simply-lid.png";
import travisLogo from "@/assets/Affiliates/travis.png";
import theRangeLogo from "@/assets/Affiliates/the-range.png";
import duluxLogo from "@/assets/Affiliates/dulux.png";
import buyShedsDirectLogo from "@/assets/Affiliates/buy-sheds-direct.jpg";
import rustOleumLogo from "@/assets/Affiliates/rust-oleum.jpg";
import aspireStoreLogo from "@/assets/Affiliates/aspire-store.jpg";

export interface Affiliate {
  name: string;
  logo: string;
  url: string;
}

export const AFFILIATES: Affiliate[] = [
  {
    name: "Travis Perkins",
    logo: travisLogo,
    url: "https://tidd.ly/3SePw3C",
  },
  {
    name: "The Range",
    logo: theRangeLogo,
    url: "https://tidd.ly/4h83rTy",
  },
  {
    name: "Dulux",
    logo: duluxLogo,
    url: "https://tidd.ly/4g6HYZ3",
  },
  {
    name: "Buy Sheds Direct",
    logo: buyShedsDirectLogo,
    url: "https://tidd.ly/4xOCyK8",
  },
  {
    name: "Simply Lids",
    logo: simplyLidLogo,
    url: "https://tidd.ly/4eOJC0X",
  },
  {
    name: "Rust-Oleum",
    logo: rustOleumLogo,
    url: "https://tidd.ly/3R5Sgjz",
  },
  {
    name: "Aspire Store",
    logo: aspireStoreLogo,
    url: "https://tidd.ly/4w9EbjR",
  },
];
