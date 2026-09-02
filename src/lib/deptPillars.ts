export type Pillar = { key: string; label: string; body: string };

const pillars: Record<string, Pillar[]> = {
  ai: [
    {
      key: "learn",
      label: "نتعلّم",
      body: "أساسيات الذكاء الإصطناعي وتعلم الآلة وخوارزمياتهم.",
    },
    { key: "apply", label: "نطبّق", body: "نبني نماذج ذكية وأدوات للأتملة وتسهيل المهام." },
    {
      key: "publish",
      label: "ننشر",
      body: "ورش وفعاليات متخصصة بمجال الذكاء الإصطناعي وتعلم الآلة.",
    },
    {
      key: "enable",
      label: "نُمكّن",
      body: "أعضاءنا للإستعداد في المشاركة بالمسابقات والهاكثونات المحلية والعالمية.",
    },
  ],
  security: [
    {
      key: "learn",
      label: "نتعلّم",
      body: "أساسيات الأمن السيبراني وإتقان بروتوكولات الحماية والتشفير وتطبيقها.",
    },
    { key: "apply", label: "نطبّق", body: "بناء أنظمة آمنة واكتشاف الثغرات وتغطيتها." },
    { key: "publish", label: "ننشر", body: "ورش وفعاليات متخصصة بمجال الأمن السيبراني." },
    {
      key: "enable",
      label: "نُمكّن",
      body: "أعضاءنا للإستعداد للحصول على الشهادات المهنية في المجال.",
    },
  ],
  app: [
    {
      key: "learn",
      label: "نتعلّم",
      body: "أساسيات برمجة التطبيقات المختلفة والإطر الحديثة والمطلوبة.",
    },
    { key: "apply", label: "نطبّق", body: "نطوّر تطبيقات كاملة من الصفر وننشرها." },
    { key: "publish", label: "ننشر", body: "ورش وفعاليات متخصصة بمجال برمجة التطبيقات." },
    {
      key: "enable",
      label: "نُمكّن",
      body: "أعضاءنا للإستعداد في إطلاق مشاريعهم وبناء ملف أعمالهم.",
    },
  ],
  uiux: [
    {
      key: "learn",
      label: "Learn",
      body: "UI/UX design fundamentals, mastering its tools, and understanding user behavior.",
    },
    { key: "apply", label: "Apply", body: "We build complete design systems and prototypes." },
    {
      key: "publish",
      label: "Publish",
      body: "Workshops and events specialized in UI/UX design.",
    },
    {
      key: "enable",
      label: "Enable",
      body: "Our members to prepare a professional portfolio ready for the job market.",
    },
  ],
};

export const deptPillars = (slug: string): Pillar[] => pillars[slug] ?? [];
