import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, CheckCircle2, ExternalLink, Gamepad2, Lock, Medal, Share2, Sparkles, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import { getDepartment } from "@/lib/community.functions";
import { completeCourse } from "@/lib/me.functions";
import { useDashboard } from "@/hooks/useDashboard";
import { Progress, Section } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { deptImage } from "@/lib/deptImages";
import { deptPath } from "@/lib/deptPaths";
import { accentStyle, arabicDate, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/departments/$slug")({
  loader: async ({ params }) => {
    const { department } = await getDepartment({ data: { slug: params.slug } });
    if (!department) throw notFound();
    return { department };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "مسار غير متاح — Google Developer" }, { name: "robots", content: "noindex" }],
      };
    }
    const d = loaderData.department;
    return {
      meta: [
        { title: `مسار ${d.name_ar} — Google Developer` },
        { name: "description", content: d.short_description_ar },
        { property: "og:title", content: `مسار ${d.name_ar} — Google Developer` },
        { property: "og:description", content: d.short_description_ar },
      ],
    };
  },
  component: DepartmentPage,
});

function DepartmentPage() {
  const { department } = Route.useLoaderData();
  const a = accentStyle(department.accent);
  const { data, user, isLoading } = useDashboard();
  const queryClient = useQueryClient();
  const complete = useServerFn(completeCourse);

  const mutation = useMutation({
    mutationFn: (courseId: string) => complete({ data: { courseId } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      if (res.points_awarded > 0) {
        toast.success(
          `أُضيفت ${arabicNumber(res.points_awarded)} نقطة وصدرت شهادتك (${res.certificate_serial})`,
        );
      } else if (res.already_completed) {
        toast.info("هذه الدورة مسجّلة مسبقًا في حسابك.");
      }
    },
    onError: () => toast.error("تعذّر تسجيل الإكمال، حاول مرة أخرى."),
  });

  const doneIds = new Set(data?.completedCourseIds ?? []);
  const progress = data?.departmentProgress.find((d) => d.slug === department.slug);
  const certificates = (data?.certificates ?? []).filter(
    (c) => c.department_slug === department.slug,
  );
  const completedCount = department.courses.filter((c) => doneIds.has(c.id)).length;
  const percent = department.courses.length
    ? Math.round((completedCount / department.courses.length) * 100)
    : 0;
  const paths = deptPath(department.slug);
  const pillars = deptPillars(department.slug);
  const totalPossiblePoints = department.courses.reduce((sum, c) => sum + c.points + 500, 0);


  return (
    <main>
      {/* Department intro */}
      <Section className="pt-8 sm:pt-12">
        <div
          className={`glass overflow-hidden rounded-3xl shadow-glass-lg ${
            department.slug === "ai"
              ? "border-t-4 border-dept-ai/40 bg-dept-ai/5"
              : department.slug === "security"
                ? "border-t-4 border-dept-security/40 bg-dept-security/5"
                : department.slug === "app"
                  ? "border-t-4 border-dept-app/40 bg-dept-app/5"
                  : department.slug === "uiux"
                    ? "border-t-4 border-dept-uiux/40 bg-dept-uiux/5"
                    : ""
          }`}
        >
          <img
            src={deptImage(department.slug)}
            alt={`مسار ${department.name_ar}`}
            width={900}
            height={600}
            className="h-40 w-full object-cover sm:h-56"
          />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`grid size-12 place-items-center rounded-2xl ${a.soft} ${a.text}`}>
                <DeptIcon name={department.icon} className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  مسار {department.name_ar}
                </h1>
                <p className="font-num text-xs tracking-wide text-muted-foreground uppercase">
                  {department.name_en}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {department.intro_ar}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="glass-soft rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">دورات المسار</p>
                <p className="font-num mt-1 text-xl font-bold text-foreground">
                  {arabicNumber(department.courses.length)}
                </p>
              </div>
              <div className="glass-soft rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">أكملت</p>
                <p className="font-num mt-1 text-xl font-bold text-foreground">
                  {arabicNumber(completedCount)}
                </p>
              </div>
              <div className="glass-soft rounded-2xl p-4">
                <p className="text-xs text-muted-foreground">نقاط المسار</p>
                <p className="font-num mt-1 text-xl font-bold text-primary">
                  {arabicNumber(progress?.points ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* تعريف المسار */}
      <Section className="pt-0">
        <div
          className={`glass overflow-hidden rounded-3xl p-6 shadow-glass-lg sm:p-8 ${
            department.slug === "ai"
              ? "border-t-4 border-dept-ai/40 bg-dept-ai/5"
              : department.slug === "security"
                ? "border-t-4 border-dept-security/40 bg-dept-security/5"
                : department.slug === "app"
                  ? "border-t-4 border-dept-app/40 bg-dept-app/5"
                  : department.slug === "uiux"
                    ? "border-t-4 border-dept-uiux/40 bg-dept-uiux/5"
                    : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <Gamepad2 className={`size-6 ${a.text}`} />
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">تعريف المسار</h2>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* قوانين اللعبة */}
            <div className="glass rounded-2xl p-5 shadow-glass">
              <div className="flex items-center gap-2">
                <Trophy className={`size-5 ${a.text}`} />
                <h3 className="text-base font-bold text-foreground sm:text-lg">قوانين اللعبة</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className={`mt-2 size-1.5 shrink-0 rounded-full ${a.bg}`} />
                  اجمع أكبر عدد من النقاط لتفوز بجوائز قيمة آخر السنة.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className={`mt-2 size-1.5 shrink-0 rounded-full ${a.bg}`} />
                  ادفع فريقك نحو الفوز بتقديم فعاليات لمسارك وكسب النقاط.
                </li>
              </ul>
            </div>

            {/* نظام النقاط */}
            <div className="glass rounded-2xl p-5 shadow-glass">
              <div className="flex items-center gap-2">
                <Medal className={`size-5 ${a.text}`} />
                <h3 className="text-base font-bold text-foreground sm:text-lg">نظام النقاط</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                كل مسار له عدد من الدورات، كل دورة لها 50 نقطة عند الإتمام.
              </p>
              <div
                className={`mt-4 rounded-2xl border border-dashed p-4 ${a.border} bg-background/50`}
              >
                <p className="text-xs font-semibold text-foreground">مثال من الواجهة:</p>
                <p className="mt-1 text-sm text-muted-foreground">مسار أساسيات الأمن السيبراني</p>
                <p className="font-num mt-1 text-sm font-bold text-primary">
                  مجموع مسار الأمن السيبراني عند الإتمام 680 نقطة
                </p>
              </div>
            </div>
          </div>

          {/* شرح النقاط */}
          <div className="mt-5 glass rounded-2xl p-5 shadow-glass">
            <div className="flex items-center gap-2">
              <Share2 className={`size-5 ${a.text}`} />
              <h3 className="text-base font-bold text-foreground sm:text-lg">شرح النقاط</h3>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Users className={`mt-0.5 size-4 shrink-0 ${a.text}`} />
                نهاية كل شهر أكثر فريق تفاعل وأنجز مهمات أكثر من الباقي بياخذ 100 نقطة إضافية على
                مجموع نقاطهم.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Share2 className={`mt-0.5 size-4 shrink-0 ${a.text}`} />
                عند إتمام قسم أو دورة أو مسار أو مشروع شارك إنجازك في X على #مطورين_المستقبل لتكسب 5
                نقاط إضافية.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Award className={`mt-0.5 size-4 shrink-0 ${a.text}`} />
                قيامك بمشروع عند الإنتهاء من دورة او مسار تكسب 20 نقطة إضافية.
              </li>
              <li className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <Sparkles className={`mt-0.5 size-4 shrink-0 ${a.text}`} />
                عند مشاركتك مع بوت قوقي في كويز تكسب 10 نقاط.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* External learning paths + points counter */}
      {paths.length > 0 && (
        <Section className="pt-0">
          <div className="glass rounded-3xl p-6 shadow-glass-lg sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-gold" />
                <h2 className="text-lg font-bold text-foreground sm:text-xl">عدّاد نقاط المسار</h2>
              </div>
              <div className="glass-soft flex items-center gap-4 rounded-2xl px-5 py-3">
                <div className="text-center">
                  <p className="font-num text-2xl font-bold text-primary sm:text-3xl">
                    {arabicNumber(progress?.points ?? 0)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">نقاطك في المسار</p>
                </div>
                <span className="h-8 w-px bg-border" aria-hidden />
                <div className="text-center">
                  <p className="font-num text-2xl font-bold text-foreground sm:text-3xl">
                    {arabicNumber(totalPossiblePoints)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">إجمالي نقاط المسار</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Progress
                percent={totalPossiblePoints ? ((progress?.points ?? 0) / totalPossiblePoints) * 100 : 0}
                className={a.bar}
              />
            </div>

            <h3 className="mt-8 text-base font-bold text-foreground sm:text-lg">
              خطة تعلّم {department.name_ar}
            </h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {paths.map((p) => (
                <a
                  key={p.url}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-soft group rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
                >
                  <p className="text-xs font-semibold text-muted-foreground">{p.provider}</p>
                  <p className="mt-1 flex items-center gap-2 text-base font-bold text-foreground">
                    {p.title}
                    <ExternalLink className="size-4 text-primary" />
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                </a>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {department.slug === "ai"
                ? "ابدأ رحلتك في عالم الذكاء الاصطناعي 🚀"
                : department.slug === "app"
                  ? "اختر المسار المناسب لك وابدأ رحلتك 🚀"
                  : department.slug === "uiux"
                    ? "ابدأ رحلتك في عالم التصميم الإبداعي 🚀"
                    : "ابدأ رحلتك في حماية الفضاء الرقمي 🚀"}
            </p>
          </div>
        </Section>
      )}

      {/* Learning path with visual progress */}
      <Section>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              مسار التعلّم
            </span>
            <h2 className="mt-3 text-xl font-bold text-foreground sm:text-2xl">
              خطوات المسار بالترتيب
            </h2>
          </div>
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>تقدّمك</span>
              <span className="font-num font-bold text-primary">{arabicNumber(percent)}٪</span>
            </div>
            <Progress percent={percent} className={a.bar} />
          </div>
        </div>

        <ol className="mt-8 space-y-3">
          {department.learn_items_ar.map((item, i) => {
            const stepDone = department.courses[i] ? doneIds.has(department.courses[i]!.id) : false;
            return (
              <li key={item} className="glass flex items-start gap-4 rounded-2xl p-4 shadow-glass">
                <span
                  className={`font-num grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${
                    stepDone ? "bg-success text-primary-foreground" : `${a.soft} ${a.text}`
                  }`}
                >
                  {stepDone ? <CheckCircle2 className="size-4" /> : arabicNumber(i + 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stepDone ? "مكتملة" : "قيد التعلّم"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Courses */}
      <Section>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">الدورات التدريبية</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          افتح الدورة على منصة سطر، ثم سجّل إكمالها لاحتساب النقاط وإصدار الشهادة.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {department.courses.map((c, i) => {
            const done = doneIds.has(c.id);
            return (
              <article key={c.id} className="glass rounded-2xl p-5 shadow-glass">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-num text-[11px] font-semibold text-muted-foreground">
                      الدورة {arabicNumber(i + 1)}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-foreground">{c.title_ar}</h3>
                  </div>
                  <span
                    className={`font-num shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                      done ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {arabicNumber(c.points)} نقطة
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.description_ar}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={c.satr_url}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-soft inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground"
                  >
                    <ExternalLink className="size-4" />
                    ابدأ على سطر
                  </a>
                  {!user ? (
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
                    >
                      <Lock className="size-4" />
                      سجّل الدخول لتسجيل الإكمال
                    </Link>
                  ) : done ? (
                    <span className="inline-flex items-center gap-2 rounded-xl bg-success/15 px-4 py-2.5 text-sm font-semibold text-success">
                      <CheckCircle2 className="size-4" />
                      مكتملة
                    </span>
                  ) : (
                    <button
                      onClick={() => mutation.mutate(c.id)}
                      disabled={mutation.isPending || isLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft disabled:opacity-60"
                    >
                      <Sparkles className="size-4" />
                      سجّل الإكمال
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Certificates + points */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-glass">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">شهادات هذا المسار</h2>
            </div>
            {certificates.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                لا توجد شهادات بعد — أكمل أول دورة في المسار لتصدر شهادتك تلقائيًا.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {certificates.map((cert) => (
                  <li key={cert.id} className="glass-soft rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground">{cert.course_title}</p>
                    <p className="font-num mt-1 text-xs text-muted-foreground">
                      {cert.serial} · {arabicDate(cert.issued_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-6 shadow-glass">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-gold" />
              <h2 className="text-lg font-bold text-foreground">نقاطك من المسار</h2>
            </div>
            <p className="font-num mt-4 text-4xl font-bold text-primary">
              {arabicNumber(progress?.points ?? 0)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {user
                ? `أكملت ${arabicNumber(completedCount)} من ${arabicNumber(department.courses.length)} دورة في هذا المسار.`
                : "سجّل الدخول لعرض نقاطك وتقدّمك في هذا المسار."}
            </p>
            <Link
              to="/profile"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
            >
              لوحة حسابي
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
