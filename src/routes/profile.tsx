import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, Save, Trophy } from "lucide-react";
import { toast } from "sonner";
import { updateMyProfile } from "@/lib/me.functions";
import { useDashboard } from "@/hooks/useDashboard";
import { Progress, Section, StatCard } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { accentStyle, arabicDate, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "ملفي — Google Developer" },
      {
        name: "description",
        content: "لوحة عضو النادي: النقاط، الترتيب، تقدّم الأقسام، الشهادات، وسجل النقاط.",
      },
      { property: "og:title", content: "ملفي — Google Developer" },
      { property: "og:description", content: "تابع نقاطك وتقدّمك وشهاداتك في مكان واحد." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data, user, authLoading, isLoading } = useDashboard();
  const queryClient = useQueryClient();
  const save = useServerFn(updateMyProfile);

  const [form, setForm] = useState({
    full_name: "",
    headline: "",
    city: "",
    bio: "",
    whatsapp_phone: "",
  });

  useEffect(() => {
    if (data?.profile) {
      setForm({
        full_name: data.profile.full_name ?? "",
        headline: data.profile.headline ?? "",
        city: data.profile.city ?? "",
        bio: data.profile.bio ?? "",
        whatsapp_phone: data.profile.whatsapp_phone ?? "",
      });
    }
  }, [data?.profile]);

  const mutation = useMutation({
    mutationFn: () => save({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("تم تحديث بياناتك.");
    },
    onError: () => toast.error("تعذّر حفظ البيانات، تحقّق من الحقول."),
  });

  if (authLoading || (user && isLoading)) {
    return (
      <main>
        <Section className="pt-12">
          <p className="text-sm text-muted-foreground">جارٍ تحميل لوحتك…</p>
        </Section>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Section className="pt-12">
          <div className="glass mx-auto max-w-md rounded-3xl p-8 text-center shadow-glass-lg">
            <h1 className="text-xl font-bold text-foreground">هذه الصفحة للأعضاء</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              سجّل الدخول لعرض نقاطك وتقدّمك وشهاداتك.
            </p>
            <Link
              to="/auth"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-soft"
            >
              تسجيل الدخول
            </Link>
          </div>
        </Section>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <div className="glass rounded-3xl p-6 shadow-glass-lg sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-xl font-bold text-primary">
              {data.profile.full_name?.charAt(0) ?? "ع"}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{data.profile.full_name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.profile.headline || "عضو في مجتمع Google Developer"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={data.profile.total_points} label="نقطة" />
            <StatCard value={`#${arabicNumber(data.rank)}`} label="الترتيب" />
            <StatCard value={data.completedCourseIds.length} label="دورة مكتملة" />
            <StatCard value={data.certificates.length} label="شهادة" />
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="text-xl font-bold text-foreground">تقدّمك في الأقسام</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {data.departmentProgress.map((d) => {
            const a = accentStyle(d.accent);
            return (
              <Link
                key={d.id}
                to="/departments/$slug"
                params={{ slug: d.slug }}
                className="glass rounded-2xl p-5 shadow-glass transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-10 place-items-center rounded-xl ${a.soft} ${a.text}`}>
                    <DeptIcon name={d.icon} className="size-5" />
                  </span>
                  <p className="flex-1 text-sm font-bold text-foreground">{d.name_ar}</p>
                  <span className="font-num text-sm font-bold text-primary">
                    {arabicNumber(d.percent)}٪
                  </span>
                </div>
                <div className="mt-4">
                  <Progress percent={d.percent} className={a.bar} />
                </div>
                <p className="font-num mt-3 text-xs text-muted-foreground">
                  {arabicNumber(d.completed)} من {arabicNumber(d.total)} دورات ·{" "}
                  {arabicNumber(d.points)} نقطة
                </p>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass rounded-2xl p-6 shadow-glass">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">شهاداتي</h2>
            </div>
            {data.certificates.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                أكمل أول دورة لتصدر شهادتك الأولى.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {data.certificates.map((c) => (
                  <li key={c.id} className="glass-soft rounded-xl p-4">
                    <p className="text-sm font-semibold text-foreground">{c.course_title}</p>
                    <p className="font-num mt-1 text-xs text-muted-foreground">
                      {c.serial} · {c.department_name} · {arabicDate(c.issued_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-2xl p-6 shadow-glass">
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-gold" />
              <h2 className="text-lg font-bold text-foreground">سجل النقاط</h2>
            </div>
            {data.transactions.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">لا توجد حركات نقاط بعد.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {data.transactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 border-b border-glass-border pb-2 last:border-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-foreground">{t.reason_ar}</span>
                      <span className="font-num block text-[11px] text-muted-foreground">
                        {arabicDate(t.created_at)}
                      </span>
                    </span>
                    <span className="font-num shrink-0 text-sm font-bold text-success">
                      +{arabicNumber(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Section>

      <Section>
        <div className="glass rounded-2xl p-6 shadow-glass">
          <h2 className="text-lg font-bold text-foreground">بياناتي</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أضف رقم واتساب المرتبط بمجموعات النادي لاحتساب نقاط تفاعلك تلقائيًا.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="mt-5 grid gap-3 sm:grid-cols-2"
          >
            {(
              [
                ["full_name", "الاسم الكامل"],
                ["headline", "نبذة قصيرة"],
                ["city", "المدينة"],
                ["whatsapp_phone", "رقم واتساب"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="text-xs font-semibold text-foreground">
                  {label}
                </label>
                <input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="bio" className="text-xs font-semibold text-foreground">
                عنّي
              </label>
              <textarea
                id="bio"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-soft disabled:opacity-60 sm:w-40"
            >
              <Save className="size-4" />
              حفظ
            </button>
          </form>
        </div>
      </Section>
    </main>
  );
}
