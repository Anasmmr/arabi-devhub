import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, Sparkles, Target } from "lucide-react";
import { getAboutData } from "@/lib/community.functions";
import { Section, SectionHead, StatCard } from "@/components/site/Bits";
import { SocialGrid } from "@/components/site/Socials";
import { clubGallery } from "@/lib/clubImages";

export const Route = createFileRoute("/about")({
  loader: () => getAboutData(),
  head: () => ({
    meta: [
      { title: "عن النادي — Google Developer" },
      {
        name: "description",
        content:
          "تعريف بنادي Google Developer: رسالته، أهدافه، إنجازاته، وصور من أنشطته ولقاءاته المجتمعية.",
      },
      { property: "og:title", content: "عن النادي — Google Developer" },
      {
        property: "og:description",
        content: "رسالة النادي وأهدافه وإنجازاته وصور من أنشطته.",
      },
    ],
  }),
  component: About,
});

const gallery = clubGallery;

const achievements = [
  "أكثر من ٦٠ لقاءً وورشة تقنية بحضور مباشر وعن بُعد.",
  "أربعة مسارات تعلّم متكاملة في تخصصات تقنية مطلوبة.",
  "آلاف الشهادات الموثّقة لأعضاء أكملوا دوراتهم بنجاح.",
  "شراكات مع مجتمعات وجامعات في أكثر من مدينة عربية.",
  "نظام نقاط شفّاف يربط التعلّم بالتقدّم داخل المجتمع.",
];

function About() {
  const { stats } = Route.useLoaderData();

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="عن النادي"
          title="مجتمع يتعلّم ويبني معًا"
          subtitle="نادي Google Developer مجتمع تطوعي للمطوّرين والمصمّمين العرب، نبني بيئة تعلّم منظّمة تساعد كل عضو على الانتقال من الفضول إلى الاحتراف بخطوات واضحة وقابلة للقياس."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Target className="size-6 text-primary" />
            <h2 className="mt-4 text-base font-bold text-foreground">رسالتنا</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              مسار تعليمي مجاني وواضح لكل مطوّر عربي، مدعوم بمجتمع يشجّعه ويقيس تقدّمه بعدل.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Sparkles className="size-6 text-primary" />
            <h2 className="mt-4 text-base font-bold text-foreground">أهدافنا</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              تمكين الأعضاء من تنفيذ مشاريع حقيقية عبر تعلّم عملي، تطبيق فوري، وتغذية راجعة مستمرة.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Award className="size-6 text-primary" />
            <h2 className="mt-4 text-base font-bold text-foreground">قيمنا</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              التعلّم المستمر، الإتقان، مشاركة المعرفة، واحتضان المبتدئين قبل الخبراء.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="إنجازاتنا" title="أرقام ولحظات من رحلتنا" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard value={stats.members} label="عضو" />
          <StatCard value={stats.events} label="لقاء" />
          <StatCard value={stats.workshops} label="ورشة" />
          <StatCard value={stats.certificates} label="شهادة" />
          <StatCard value={stats.completions} label="دورة مكتملة" />
        </div>

        <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a}
              className="glass-soft flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm leading-relaxed text-foreground"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.map((g, i) => (
            <figure
              key={g.alt}
              className={`glass overflow-hidden rounded-2xl p-1.5 shadow-glass transition-transform duration-500 hover:-translate-y-1 ${
                i === 0 ? "col-span-2 sm:row-span-2" : ""
              }`}
            >
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                width={1200}
                height={800}
                className="h-full w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
            </figure>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHead eyebrow="حسابات النادي" title="تابعنا على قنواتنا" />
        <div className="mt-8">
          <SocialGrid />
        </div>
      </Section>
    </main>
  );
}
