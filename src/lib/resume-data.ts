// Resume dropdown configuration
// Each entry shows as a clickable item in the Resume dropdown menu

export interface ResumeOption {
  label: string;
  description: string;
  href: string;
  icon: string; // lucide icon name
  external?: boolean;
}

export const resumeOptions: ResumeOption[] = [
  {
    label: "LinkedIn Profile",
    description: "View my professional profile",
    href: "https://www.linkedin.com/in/farhan-akhtar-ba942126a",
    icon: "Linkedin",
    external: true,
  },
  {
    label: "GitHub Profile",
    description: "View my open source projects",
    href: "https://github.com/FarhanAkhtar4",
    icon: "Github",
    external: true,
  },
  {
    label: "HuggingFace",
    description: "View my ML demos & models",
    href: "https://huggingface.co/FarhanAkhtar11",
    icon: "Globe",
    external: true,
  },
];
