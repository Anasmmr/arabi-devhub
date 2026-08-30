export type ExternalPath = {
  title: string;
  provider: string;
  description: string;
  url: string;
};

/** Curated external learning paths per department slug. */
export const deptPaths: Record<string, ExternalPath[]> = {
  ai: [
    {
      title: "مسار تعلم الذكاء الاصطناعي",
      provider: "منصة سطر — طويق",
      description: "مسار متكامل بالعربية يغطي أساسيات الذكاء الاصطناعي وتعلم الآلة وكيفية بناء نماذج ذكية.",
      url: "https://satr.tuwaiq.edu.sa/path/zaNuCyeqGx/view",
    },
  ],
  app: [
    {
      title: "مسار تطوير تطبيقات Flutter",
      provider: "منصة سطر — طويق",
      description: "ابنِ تطبيقات موبايل متعددة المنصات باستخدام Flutter وDart من الصفر حتى النشر.",
      url: "https://satr.tuwaiq.edu.sa/path/OHarLRCHae/view",
    },
    {
      title: "مسار تطوير تطبيقات iOS",
      provider: "منصة سطر — طويق",
      description: "تعلّم Swift وSwiftUI وبناء تطبيقات iOS احترافية تتوافق مع معايير أبل.",
      url: "https://satr.tuwaiq.edu.sa/path/TxrppJSrgx/view",
    },
    {
      title: "مسار تطوير تطبيقات Android",
      provider: "منصة سطر — طويق",
      description: "مسار عملي لتطوير تطبيقات Android باستخدام Kotlin وأدوات Google الحديثة.",
      url: "https://satr.tuwaiq.edu.sa/path/KGYLmAVZWT/view",
    },
    {
      title: "مسار تطوير الألعاب",
      provider: "منصة سطر — طويق",
      description: "ادخل عالم تطوير الألعاب وتعلّم المحركات والأفكار التقنية لبناء ألعابك الأولى.",
      url: "https://satr.tuwaiq.edu.sa/path/QkAdKXTgYY/view",
    },
  ],
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
