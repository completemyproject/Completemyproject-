import simplyLidLogo from "@/assets/Affiliates/simply-lid.png";
import travisLogo from "@/assets/Affiliates/travis.png";

export interface Affiliate {
  name: string;
  logo: string;
  url: string;
}

export const AFFILIATES: Affiliate[] = [
  {
    name: "Simply Lids",
    logo: simplyLidLogo,
    url: "https://tidd.ly/4eOJC0X",
  },
  {
    name: "Travis Perkins",
    logo: travisLogo,
    url: "https://tidd.ly/3SePw3C",
  },
];
