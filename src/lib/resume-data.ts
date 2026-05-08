// Resume dropdown configuration
// Each entry shows as a clickable item in the Resume dropdown menu

export interface ResumeOption {
  label: string;
  description: string;
  href: string;
  icon: string; // lucide icon name
  external?: boolean;
}

export const resumeDownloads: ResumeOption[] = [
  {
    label: "ML Engineer Resume",
    description: "Download PDF",
    href: "/resumes/Farhan_Akhtar_ML_Engineer.pdf",
    icon: "FileText",
  },
  {
    label: "AI Engineer Resume",
    description: "Download PDF",
    href: "/resumes/Farhan_Akhtar_AI_Engineer.pdf",
    icon: "FileText",
  },
  {
    label: "Agentic AI Engineer Resume",
    description: "Download PDF",
    href: "/resumes/Farhan_Akhtar_Agentic_AI_Engineer.pdf",
    icon: "FileText",
  },
  {
    label: "GenAI Engineer Resume",
    description: "Download PDF",
    href: "/resumes/Farhan_Akhtar_GenAI_Engineer.pdf",
    icon: "FileText",
  },
];

export const profileLinks: ResumeOption[] = [
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

// Combined for backwards compatibility
export const resumeOptions: ResumeOption[] = [...resumeDownloads, ...profileLinks];
