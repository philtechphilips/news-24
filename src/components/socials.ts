import { InstagramLogo, LinkedInLogo, XLogo } from "./icons";

export const socials = [
  { key: "x", href: "https://x.com", label: "X", Icon: XLogo },
  { key: "instagram", href: "https://instagram.com", label: "Instagram", Icon: InstagramLogo },
  { key: "linkedin", href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedInLogo },
] as const;
