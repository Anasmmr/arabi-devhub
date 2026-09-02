import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Gamepad2,
  Medal,
  Share2,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { getDepartments } from "@/lib/community.functions";
import { Section, SectionHead } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { deptImage } from "@/lib/deptImages";
import { accentStyle, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/departments/")({
  loader: () => getDepartments(),
  head: () => ({
    meta: [
      { title: "لعبة المسارات — Google Developer" },
      {
        name: "description",
        content:
          "مسارات النادي: الذكاء الاصطناعي، تطوير التطبيقات، الأمن السيبراني، وتصميم واجهات المستخدم — لكل مسار خطة تعلّم ودورات ونقاط وشهادات.",
      },
      { property: "og:title", content: "لعبة المسارات — Google Developer" },
      {
        property: "og:description",
        content: "اختر مسارك وابدأ رحلة التعلّم مع دورات عملية ونقاط وشهادات موثّقة.",
      },
    ],
  }),
  component: Departments,
});

function Departments() {
  const { departments } = Route.useLoaderData();

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="لعبة المسارات"
          title="اختر مسارك وابدأ اللعبة"
          subtitle="كل مسار يبدأ من الأساسيات ويتدرّج نحو مشاريع تطبيقية، مع نقاط وشهادة لكل دورة."
        />
        {/* قوانين اللعبة */}
        <div className="glass mt-8 overflow-hidden rounded-3xl border-t-4 border-primary/40 p-6 shadow-glass-lg sm:p-8">
          <div className="flex items-center gap-2">
            <Gamepad2 className="size-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">تعريف اللعبة</h2>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="glass rounded-2xl p-5 shadow-glass">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground sm:text-lg">قوانين اللعبة</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  اجمع أكبر عدد من النقاط لتفوز بجوائز قيمة آخر السنة.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  ادفع فريقك نحو الفوز بتقديم فعاليات لمسارك وكسب النقاط.
                </li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-5 shadow-glass">
              <div className="flex items-center gap-2">
                <Medal className="size-5 text-primary" />
                <h3 className="text-base font-bold text-foreground sm:text-lg">نظام النقاط</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                كل مسار له عدد من الدورات، كل دورة لها 50 نقطة عند الإتمام.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-background/50 p-4">
                <p className="text-xs font-semibold text-foreground">مثال من الواجهة:</p>
                <p className="mt-1 text-sm text-muted-foreground">مسار أساسيات الأمن السيبراني</p>
                <p className="font-num mt-1 text-sm font-bold text-primary">
                  مجموع مسار الأمن السيبراني عند الإتمام 680 نقطة
                </p>
              </div>
            </div>
          </div>

          <div className="glass mt-5 rounded-2xl p-5 shadow-glass">
            <div className="flex items-center gap-2">
              <Share2 className="size-5 text-primary" />
              <h3 className="text-base font-bold text-foreground sm:text-lg">شرح النقاط</h3>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Users className="mt-0.5 size-4 shrink-0 text-primary" />
                نهاية كل شهر أكثر فريق تفاعل وأنجز مهمات أكثر من الباقي بياخذ 100 نقطة إضافية على
                مجموع نقاطهم.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Share2 className="mt-0.5 size-4 shrink-0 text-primary" />
                عند إتمام قسم أو دورة أو مسار أو مشروع شارك إنجازك في X على #مطورين_المستقبل لتكسب 5
                نقاط إضافية.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                قيامك بمشروع عند الإنتهاء من دورة او مسار تكسب 20 نقطة إضافية.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                عند مشاركتك مع بوت قوقي في كويز تكسب 10 نقاط.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {departments.map((d) => {
            const a = accentStyle(d.accent);
            return (
              <article
                key={d.id}
                className={`glass group relative flex flex-col overflow-hidden rounded-2xl shadow-glass transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_50px_-18px_var(--dept-${d.slug})]`}
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${a.bg}`} aria-hidden />
                <img
                  src={deptImage(d.slug)}
                  alt={`مسار ${d.name_ar}`}
                  loading="lazy"
                  width={900}
                  height={600}
                  className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid size-11 place-items-center rounded-xl ${a.soft} ${a.text}`}
                    >
                      <DeptIcon name={d.icon} className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{d.name_ar}</h2>
                      <p className="font-num text-[11px] tracking-wide text-muted-foreground uppercase">
                        {d.name_en}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {d.short_description_ar}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="font-num inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <BookOpen className="size-4" />
                      {arabicNumber(d.courses.length)} دورات
                    </span>
                    <Link
                      to="/departments/$slug"
                      params={{ slug: d.slug }}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all ${a.bg} hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2 ${a.ring}`}
                    >
                      ادخل المسار
                      <ArrowLeft className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
