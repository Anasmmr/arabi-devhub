import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, CheckCircle2, MessageCircle, Sparkles, Target, Trophy } from "lucide-react";
import { getHomeData } from "@/lib/community.functions";
import { Section, SectionHead, StatCard } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { SocialGrid } from "@/components/site/Socials";
import { deptImage } from "@/lib/deptImages";
import { accentStyle, arabicNumber } from "@/lib/dept";
import { clubCover, clubGallery } from "@/lib/clubImages";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: () => ({
    meta: [
      { title: "Google Developer — مجتمع المطورين العربي" },
      {
        name: "description",
        content:
          "نادي Google Developer: تعريف بالنادي وإنجازاته، أقسام تعلّم في الذكاء الاصطناعي والتطبيقات والأمن السيبراني وتصميم الواجهات، مع نقاط وشهادات ولوحة صدارة.",
      },
      { property: "og:title", content: "Google Developer — مجتمع المطورين العربي" },
      {
        property: "og:description",
        content: "تعلّم، أكمل الدورات، اجمع النقاط، واحصل على شهاداتك مع مجتمع Google Developer.",
      },
    ],
  }),
  component: Home,
});

const gallery = clubGallery;

const achievements = [
  "أكثر من ٦٠ لقاءً وورشة تقنية بحضور مباشر وعن بُعد.",
  "مسارات تعلّم متكاملة في أربعة تخصصات تقنية مطلوبة.",
  "آلاف الشهادات الموثّقة لأعضاء أكملوا دوراتهم بنجاح.",
  "شراكات مع مجتمعات وجامعات في أكثر من مدينة عربية.",
];

function Home() {
  const { departments, leaderboard, stats } = Route.useLoaderData();

  return (
    <main>
      {/* Hero */}
      <Section className="pt-8 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <span className="glass-soft inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              مجتمع مطوّرين عربي بمعايير احترافية
            </span>
            <h1 className="mt-5 text-3xl leading-[1.25] font-bold tracking-tight text-foreground sm:text-5xl sm:leading-[1.2]">
              تعلّم التقنية بمسار واضح،
              <br />
              وتقدّم بنقاط وشهادات حقيقية
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              نادي Google Developer يجمع المطوّرين في الشرق الأوسط حول أقسام متخصصة، مسارات تعلّم
              منظّمة، ونظام نقاط يحوّل تعلّمك إلى تقدّم ملموس تراه في ملفك ولوحة الصدارة.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/departments"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary-soft"
              >
                استكشف الأقسام
                <ArrowLeft className="size-4" />
              </Link>
              <Link
                to="/"
                hash="socials"
                className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-foreground shadow-glass transition-transform hover:-translate-y-0.5"
              >
                الانضمام إلينا
              </Link>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              <StatCard value={stats.members} label="عضو في المجتمع" />
              <StatCard value={stats.certificates} label="شهادة صادرة" />
              <StatCard value={stats.completions} label="دورة مكتملة" />
            </dl>
          </div>
          <div className="reveal overflow-hidden rounded-3xl shadow-glass-lg">
            <img
              src={clubCover.src}
              alt={clubCover.alt}
              width={1290}
              height={860}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Section>

      {/* 1. About the club: intro + mission */}
      <Section>
        <SectionHead
          eyebrow="عن النادي"
          title="من نحن؟"
          subtitle="نادي Google Developer هو مجتمع تطوعي للمطوّرين والمصمّمين العرب، نبني فيه بيئة تعلّم منظّمة وودّية تساعد كل عضو على الانتقال من الفضول إلى الاحتراف بخطوات واضحة."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Target className="size-6 text-primary" />
            <h3 className="mt-4 text-base font-bold text-foreground">رسالتنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              أن نوفّر لكل مطوّر عربي مسارًا تعليميًا مجانيًا وواضحًا، مدعومًا بمجتمع يشجّعه ويقيس
              تقدّمه بشكل عادل وشفّاف.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Sparkles className="size-6 text-primary" />
            <h3 className="mt-4 text-base font-bold text-foreground">هدفنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              بناء جيل من المطوّرين قادر على تنفيذ مشاريع حقيقية، عبر تعلّم عملي وتطبيق فوري وتغذية
              راجعة من أعضاء المجتمع.
            </p>
          </div>
          <div className="glass rounded-2xl p-6 shadow-glass">
            <Award className="size-6 text-primary" />
            <h3 className="mt-4 text-base font-bold text-foreground">قيمنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              التعلّم المستمر، الإتقان، مشاركة المعرفة، واحتضان المبتدئين قبل الخبراء — بدون تعقيد
              أو تكاليف.
            </p>
          </div>
        </div>
      </Section>

      {/* 2. Achievements + 5 placeholder images */}
      <Section>
        <SectionHead
          eyebrow="إنجازاتنا"
          title="ما حقّقناه حتى الآن"
          subtitle="أرقام ولحظات من رحلة النادي مع أعضائه. الصور الحالية مؤقتة ويمكن استبدالها بصور النادي الحقيقية."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard value={stats.members} label="عضو" />
              <StatCard value={stats.events} label="لقاء مجتمعي" />
              <StatCard value={stats.workshops} label="ورشة تدريبية" />
              <StatCard value={stats.certificates} label="شهادة" />
            </div>
            <ul className="mt-4 space-y-2.5">
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
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g, i) => (
              <figure
                key={g.alt}
                className={`glass overflow-hidden rounded-2xl p-1.5 shadow-glass transition-transform duration-500 hover:-translate-y-1 ${
                  i === 0 ? "col-span-2 sm:col-span-2 sm:row-span-2" : ""
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
        </div>
      </Section>

      {/* 3. Departments */}
      <Section>
        <SectionHead
          eyebrow="الأقسام"
          title="أربعة أقسام، مسار واضح لكل واحد"
          subtitle="كل قسم يحتوي على مسار تعلّم متدرّج ودورات عملية تُمنح عليها نقاط وشهادة."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => {
            const a = accentStyle(d.accent);
            return (
              <article
                key={d.id}
                className="glass group flex flex-col overflow-hidden rounded-2xl shadow-glass transition-transform duration-500 hover:-translate-y-1.5"
              >
                <div className="overflow-hidden">
                  <img
                    src={deptImage(d.slug)}
                    alt={`قسم ${d.name_ar}`}
                    loading="lazy"
                    width={900}
                    height={600}
                    className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span
                    className={`grid size-11 place-items-center rounded-xl ${a.soft} ${a.text}`}
                  >
                    <DeptIcon name={d.icon} className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{d.name_ar}</h3>
                  <p className="font-num mt-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                    {d.name_en}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {d.short_description_ar}
                  </p>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: d.slug }}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
                  >
                    ادخل القسم
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* 4. Club social accounts */}
      <Section id="socials">
        <SectionHead
          eyebrow="حسابات النادي"
          title="تابعنا وانضم للنقاش"
          subtitle="كل الإعلانات والورش والفرص تُنشر أولًا على قنوات النادي. الروابط الحالية مؤقتة."
        />
        <div className="mt-8">
          <SocialGrid />
        </div>
      </Section>

      {/* 5. Leaderboard — top 5, rank + name + points only */}
      <Section>
        <SectionHead
          eyebrow="لوحة الصدارة"
          title="أعلى ٥ أعضاء بالنقاط"
          subtitle="النقاط تُجمع من إكمال الدورات والتفاعل في مجموعات النادي."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {leaderboard.slice(0, 5).map((m) => (
            <li
              key={m.id}
              className="glass flex items-center gap-3 rounded-2xl p-4 shadow-glass transition-transform hover:-translate-y-1"
            >
              <span
                className={`font-num grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold ${
                  m.rank === 1
                    ? "bg-gold/20 text-gold"
                    : m.rank === 2
                      ? "bg-silver/20 text-silver"
                      : m.rank === 3
                        ? "bg-bronze/20 text-bronze"
                        : "bg-primary/10 text-primary"
                }`}
              >
                {arabicNumber(m.rank)}
              </span>
              <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                {m.avatar_url ? (
                  <img
                    src={m.avatar_url}
                    alt={m.full_name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  m.full_name.charAt(0)
                )}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {m.full_name}
              </span>
              <span className="font-num shrink-0 text-sm font-bold text-primary">
                {arabicNumber(m.total_points)} نقطة
              </span>
            </li>
          ))}
        </ul>
        <Link
          to="/leaderboard"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          اللوحة الكاملة
          <ArrowLeft className="size-3.5" />
        </Link>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHead eyebrow="كيف يعمل النظام" title="من التعلّم إلى الشهادة في أربع خطوات" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "اختر قسمك", body: "أربعة أقسام متخصصة، كل قسم بمسار تعلّم واضح ومتدرّج." },
            { title: "أكمل الدورات", body: "دورات قصيرة عملية على منصة سطر، مع تتبّع تقدّمك." },
            { title: "اجمع النقاط", body: "كل إنجاز يضيف نقاطًا لملفك، وتفاعلك في واتساب يُحتسب." },
            { title: "استلم شهادتك", body: "شهادة موثّقة برقم تسلسلي لكل دورة تُكملها بنجاح." },
          ].map((s, i) => (
            <li key={s.title} className="glass rounded-2xl p-5 shadow-glass">
              <span className="font-num grid size-9 place-items-center rounded-xl bg-ink text-sm font-bold text-primary-foreground">
                {arabicNumber(i + 1)}
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Features */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: CheckCircle2,
              title: "تتبّع تقدّم دقيق",
              body: "نسبة إنجاز لكل قسم، وسجل كامل لكل دورة أكملتها ونقاطها.",
            },
            {
              icon: Trophy,
              title: "شهادات موثّقة",
              body: "لكل دورة شهادة برقم تسلسلي فريد تظهر في ملفك الشخصي.",
            },
            {
              icon: MessageCircle,
              title: "تكامل واتساب",
              body: "تفاعلك وإجاباتك الصحيحة عبر Googlely تُضيف نقاطًا إلى حسابك تلقائيًا.",
            },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 shadow-glass">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-base font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass relative overflow-hidden rounded-3xl p-8 text-center shadow-glass-lg sm:p-12">
          <div className="absolute -top-24 -left-24 size-64 rounded-full bg-primary/10 blur-3xl" />
          <h2 className="relative text-2xl font-bold text-foreground sm:text-3xl">
            جاهز تبدأ مسارك اليوم؟
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            أنشئ حسابك، اختر قسمك، وابدأ بجمع النقاط والشهادات مع بقية أعضاء المجتمع.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary-soft"
            >
              انضم للمجتمع
            </Link>
            <Link
              to="/about"
              className="glass-soft inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-foreground"
            >
              تعرّف على النادي
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
