export type ExternalPath = {
  title: string;
  provider: string;
  description: string;
  url: string;
};

/** Curated external learning paths per department slug. */
export const deptPaths: Record<string, ExternalPath[]> = {
  security: [
    {
      title: "مسار الأمن السيبراني",
      provider: "منصة سطر — طويق",
      description: "مسار متكامل بالعربية يغطي أساسيات الأمن السيبراني وحماية الأنظمة والشبكات.",
      url: "https://satr.tuwaiq.edu.sa/path/E0v6z0oS6R/view",
    },
    {
      title: "المسار المهني للأمن السيبراني",
      provider: "Cisco NetAcad",
      description: "مسار مهني معتمد من سيسكو بالعربية يؤهلك لوظائف الأمن السيبراني خطوة بخطوة.",
      url: "https://www.netacad.com/ar/career-paths/cybersecurity?courseLang=ar-SA",
    },
  ],
};

export const deptPath = (slug: string) => deptPaths[slug] ?? [];
