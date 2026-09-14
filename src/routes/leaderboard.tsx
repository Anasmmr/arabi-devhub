import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getDepartments } from "@/lib/community.functions";
import { addDepartmentPoints, getDepartmentScores } from "@/lib/members.functions";
import { getMyRoles } from "@/lib/admin.functions";
import { useSession } from "@/hooks/useSession";
import { Section, SectionHead } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { deptImage } from "@/lib/deptImages";
import { accentStyle, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/leaderboard")({
  loader: () => getDepartments(),
  head: () => ({
    meta: [
      { title: "لوحة الصدارة — Google Developer" },
      {
        name: "description",
        content: "متابعة مجموع نقاط المسارات الأربعة ومعرفة الأعلى بينها.",
      },
      { property: "og:title", content: "لوحة الصدارة — Google Developer" },
      {
        property: "og:description",
        content: "عداد نقاط المسارات لمعرفة صاحب المركز الأول.",
      },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { departments } = Route.useLoaderData();
  const { user } = useSession();
  const queryClient = useQueryClient();

  const fetchScores = useServerFn(getDepartmentScores);
  const fetchRoles = useServerFn(getMyRoles);
  const addPoints = useServerFn(addDepartmentPoints);

  const scoresQuery = useQuery({ queryKey: ["dept-scores"], queryFn: () => fetchScores() });
  const rolesQuery = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => fetchRoles(),
    enabled: Boolean(user),
  });
  const canAward = Boolean(rolesQuery.data?.isAdmin || rolesQuery.data?.isModerator);

  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [reasons, setReasons] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (vars: { departmentId: string; amount: number; reason: string }) =>
      addPoints({ data: vars }),
    onSuccess: (_r, vars) => {
      setAmounts((a) => ({ ...a, [vars.departmentId]: "" }));
      setReasons((r) => ({ ...r, [vars.departmentId]: "" }));
      queryClient.invalidateQueries({ queryKey: ["dept-scores"] });
      toast.success("تمت إضافة النقاط للمسار.");
    },
    onError: () => toast.error("تعذّرت إضافة النقاط."),
  });

  const scores = scoresQuery.data?.scores ?? {};

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead eyebrow="لوحة الصدارة" title="نقاط المسارات" />

        {canAward && (
          <p className="mt-4 text-sm text-muted-foreground">
            بصفتك مشرفاً يمكنك إضافة النقاط لكل مسار من الخانة أسفل بطاقته.
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => {
            const a = accentStyle(d.accent);
            const total = scores[d.id] ?? 0;
            return (
              <article
                key={d.id}
                className="glass relative flex flex-col overflow-hidden rounded-2xl shadow-glass transition-transform hover:-translate-y-1"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${a.bg}`} aria-hidden />
                <div className="relative h-32 w-full">
                  <img
                    src={deptImage(d.slug)}
                    alt={d.name_ar}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col items-center p-6">
                  <span className={`grid size-12 place-items-center rounded-xl ${a.soft} ${a.text}`}>
                    <DeptIcon name={d.icon} className="size-6" />
                  </span>
                  <h2 className="mt-4 text-center text-lg font-bold text-foreground">{d.name_ar}</h2>
                  <p className={`font-num mt-3 text-4xl font-extrabold ${a.text}`}>
                    {arabicNumber(total)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">نقطة</p>

                  {canAward && (
                    <form
                      className="mt-5 w-full space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const value = Number(amounts[d.id]);
                        if (!Number.isFinite(value) || value === 0) {
                          toast.error("اكتب عدد نقاط صحيح.");
                          return;
                        }
                        mutation.mutate({
                          departmentId: d.id,
                          amount: Math.trunc(value),
                          reason: reasons[d.id] ?? "",
                        });
                      }}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        value={amounts[d.id] ?? ""}
                        onChange={(e) => setAmounts((s) => ({ ...s, [d.id]: e.target.value }))}
                        placeholder="عدد النقاط"
                        aria-label={`عدد النقاط لمسار ${d.name_ar}`}
                        className="font-num w-full rounded-xl bg-glass px-3 py-2.5 text-center text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary"
                      />
                      <input
                        type="text"
                        value={reasons[d.id] ?? ""}
                        onChange={(e) => setReasons((s) => ({ ...s, [d.id]: e.target.value }))}
                        placeholder="السبب (اختياري)"
                        aria-label={`سبب النقاط لمسار ${d.name_ar}`}
                        className="w-full rounded-xl bg-glass px-3 py-2.5 text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary"
                      />
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary disabled:opacity-60"
                      >
                        <Plus className="size-4" />
                        إضافة نقاط
                      </button>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
