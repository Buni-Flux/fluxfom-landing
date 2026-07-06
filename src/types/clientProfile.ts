export type ClientProfileTabId =
  | "brand-brief"
  | "brand-strategy"
  | "creative-direction"
  | "logo-suite"
  | "colors-fonts"
  | "applications"
  | "launch-templates";

export type ClientProfileData = {
  brandBrief?: {
    html?: string;
    summary?: string;
  };
  brandStrategy?: {
    left?: string[];
    right?: string[];
  };
  creativeDirection?: {
    palette?: { name: string; hex: string }[];
    moodImages?: string[];
    notes?: { title: string; body: string }[];
  };
  logoSuite?: {
    rows?: { label: string; imageUrl?: string; text?: string }[];
  };
  colorsAndFonts?: {
    colors?: { name: string; hex: string }[];
    fonts?: { role: string; label: string; sample: string }[];
  };
  applications?: {
    images?: string[];
  };
  launchTemplates?: {
    images?: string[];
  };
};

export type ClientProfileTab = {
  id: ClientProfileTabId;
  label: string;
  panelBg: string;
  tabBg: string;
  tabText: string;
  activeTabText: string;
};

export const CLIENT_PROFILE_TABS: ClientProfileTab[] = [
  {
    id: "brand-brief",
    label: "Brand Brief",
    panelBg: "#F5F0E6",
    tabBg: "#F5F0E6",
    tabText: "#1B2B22",
    activeTabText: "#1B2B22",
  },
  {
    id: "brand-strategy",
    label: "Brand Strategy",
    panelBg: "#FAF7F2",
    tabBg: "#FAF7F2",
    tabText: "#1B2B22",
    activeTabText: "#1B2B22",
  },
  {
    id: "creative-direction",
    label: "Creative Direction",
    panelBg: "#3D4A32",
    tabBg: "#3D4A32",
    tabText: "#FAF7F2",
    activeTabText: "#FAF7F2",
  },
  {
    id: "logo-suite",
    label: "Logo Suite",
    panelBg: "#FAF7F2",
    tabBg: "#FAF7F2",
    tabText: "#1B2B22",
    activeTabText: "#1B2B22",
  },
  {
    id: "colors-fonts",
    label: "Colors & Fonts",
    panelBg: "#B8C4A8",
    tabBg: "#B8C4A8",
    tabText: "#1B2B22",
    activeTabText: "#1B2B22",
  },
  {
    id: "applications",
    label: "Applications",
    panelBg: "#C4A574",
    tabBg: "#C4A574",
    tabText: "#1B2B22",
    activeTabText: "#1B2B22",
  },
  {
    id: "launch-templates",
    label: "Launch Templates",
    panelBg: "#3A2A1F",
    tabBg: "#3A2A1F",
    tabText: "#E8DCC6",
    activeTabText: "#E8DCC6",
  },
];

export type ClientWorkRow = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  preview_image_url?: string | null;
  client_tagline?: string | null;
  client_location?: string | null;
  timeline?: string | null;
  profile_data?: ClientProfileData | null;
};

export type ResolvedClientProfile = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  timeline: string;
  coverImage: string | null;
  data: ClientProfileData;
};
