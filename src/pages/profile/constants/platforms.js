import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiYoutube,
  FiGlobe,
  FiLink,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaDiscord,
  FaTelegram,
  FaDribbble,
  FaBehance,
} from "react-icons/fa";

export const PLATFORMS = [
  {
    value: "github",
    label: "GitHub",
    Icon: FiGithub,
    placeholder: "https://github.com/username",
    color: "#6e5494",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    Icon: FiLinkedin,
    placeholder: "https://linkedin.com/in/username",
    color: "#0077b5",
  },
  {
    value: "facebook",
    label: "Facebook",
    Icon: FaFacebookF,
    placeholder: "https://facebook.com/username",
    color: "#1877f2",
  },
  {
    value: "twitter",
    label: "Twitter",
    Icon: FiTwitter,
    placeholder: "https://twitter.com/username",
    color: "#1da1f2",
  },
  {
    value: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    placeholder: "https://instagram.com/username",
    color: "#e1306c",
  },
  {
    value: "youtube",
    label: "YouTube",
    Icon: FiYoutube,
    placeholder: "https://youtube.com/@channel",
    color: "#ff0000",
  },
  {
    value: "discord",
    label: "Discord",
    Icon: FaDiscord,
    placeholder: "https://discord.gg/invite",
    color: "#5865f2",
  },
  {
    value: "telegram",
    label: "Telegram",
    Icon: FaTelegram,
    placeholder: "https://t.me/username",
    color: "#0088cc",
  },
  {
    value: "dribbble",
    label: "Dribbble",
    Icon: FaDribbble,
    placeholder: "https://dribbble.com/username",
    color: "#ea4c89",
  },
  {
    value: "behance",
    label: "Behance",
    Icon: FaBehance,
    placeholder: "https://behance.net/username",
    color: "#1769ff",
  },
  {
    value: "website",
    label: "Website",
    Icon: FiGlobe,
    placeholder: "https://yourwebsite.com",
    color: "#10b981",
  },
  {
    value: "other",
    label: "Other",
    Icon: FiLink,
    placeholder: "https://...",
    color: "#94a3b8",
  },
];

export const getPlatformMeta = (value) =>
  PLATFORMS.find((p) => p.value === value) || PLATFORMS[PLATFORMS.length - 1];
