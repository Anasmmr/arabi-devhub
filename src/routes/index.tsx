import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, CheckCircle2, MessageCircle, Sparkles, Trophy } from "lucide-react";
import { getHomeData } from "@/lib/community.functions";
import { Section, SectionHead, StatCard } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { accentStyle, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: () => ({
    meta: [
      { title: "Google Developer — مجتمع المطورين العربي" },
      {
        name: "description",
        content:
          "انضم إلى مجتمع Google Developer: أقسام تعلّم في الذكاء الاصطناعي والتطبيقات والأمن السيبراني وتصميم الواجهات، مع نقاط وشهادات ولوحة صدارة.",
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

const steps = [
  { title: "اختر قسمك", body: "أربعة أقسام متخصصة، كل قسم بمسار تعلّم واضح ومتدرّج." },
  { title: "أكمل الدورات", body: "دورات قصيرة عملية على منصة سطر، مع تتبّع تقدّمك تلقائيًا." },
  { title: "اجمع النقاط", body: "كل إنجاز يضيف نقاطًا لملفك، وتفاعلك في واتساب يُحتسب أيضًا." },
  { title: "استلم شهادتك", body: "شهادة موثّقة برقم تسلسلي لكل دورة تُكملها بنجاح." },
];

function Home() {
  const { departments, leaderboard, stats } = Route.useLoaderData();

  return (
    <main>
      {/* Hero */}
      <Section className="pt-8 sm:pt-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
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
                to="/auth"
                className="glass inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-foreground shadow-glass transition-transform hover:-translate-y-0.5"
              >
                أنشئ حسابك
              </Link>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              <StatCard value={stats.members} label="عضو في المجتمع" />
              <StatCard value={stats.certificates} label="شهادة صادرة" />
              <StatCard value={stats.completions} label="دورة مكتملة" />
            </dl>
          </div>

          <div className="glass reveal rounded-3xl p-5 shadow-glass-lg sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">أعلى الأعضاء هذا الشهر</p>
              <Trophy className="size-4 text-gold" />
            </div>
            <ul className="mt-4 space-y-2.5">
              {leaderboard.slice(0, 5).map((m) => (
                <li
                  key={m.id}
                  className="glass-soft flex items-center gap-3 rounded-xl px-3 py-2.5 transition-transform hover:-translate-y-0.5"
                >
                  <span
                    className={`font-num grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${
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
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {m.full_name}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {m.headline ?? m.city ?? "عضو"}
                    </span>
                  </span>
                  <span className="font-num text-sm font-bold text-primary">
                    {arabicNumber(m.total_points)}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/leaderboard"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              اللوحة الكاملة
              <ArrowLeft className="size-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Departments */}
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
              <Link
                key={d.id}
                to="/departments/$slug"
                params={{ slug: d.slug }}
                className="glass group flex flex-col rounded-2xl p-5 shadow-glass transition-transform hover:-translate-y-1"
              >
                <span className={`grid size-11 place-items-center rounded-xl ${a.soft} ${a.text}`}>
                  <DeptIcon name={d.icon} className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{d.name_ar}</h3>
                <p className="font-num mt-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                  {d.name_en}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {d.short_description_ar}
                </p>
                <span className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">
                  <span className="font-num">{arabicNumber(d.courses.length)} دورات</span>
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <SectionHead
          eyebrow="كيف يعمل النظام"
          title="من التعلّم إلى الشهادة في أربع خطوات"
        />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
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
              icon: Award,
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
