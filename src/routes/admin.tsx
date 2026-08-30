import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ShieldCheck, ShieldOff, ShieldPlus, Star } from "lucide-react";
import { toast } from "sonner";
import { getMyRoles, listMembers, setMemberRole } from "@/lib/admin.functions";
import { useSession } from "@/hooks/useSession";
import { Section } from "@/components/site/Bits";
import { arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "الإدارة — Google Developer" },
      {
        name: "description",
        content: "لوحة الإدارة: إدارة أعضاء النادي ومنح صلاحيات الإشراف والإدارة.",
      },
      { property: "og:title", content: "الإدارة — Google Developer" },
      { property: "og:description", content: "إدارة الأعضاء وصلاحيات الإشراف." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useSession();
  const fetchRoles = useServerFn(getMyRoles);
  const fetchMembers = useServerFn(listMembers);
  const changeRole = useServerFn(setMemberRole);
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => fetchRoles(),
    enabled: Boolean(user),
  });
  const isAdmin = rolesQuery.data?.isAdmin ?? false;

  const membersQuery = useQuery({
    queryKey: ["admin-members"],
    queryFn: () => fetchMembers(),
    enabled: isAdmin,
  });

  const mutation = useMutation({
    mutationFn: (vars: { userId: string; role: "admin" | "moderator"; grant: boolean }) =>
      changeRole({ data: vars }),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-members"] });
      toast.success(
        vars.grant
          ? `تم منح صلاحية ${vars.role === "admin" ? "الإدارة" : "الإشراف"}.`
          : `تم سحب صلاحية ${vars.role === "admin" ? "الإدارة" : "الإشراف"}.`,
      );
    },
    onError: () => toast.error("تعذّر تغيير الصلاحية."),
  });

  if (loading || (user && rolesQuery.isLoading)) {
    return (
      <main>
        <Section className="pt-12">
          <p className="text-sm text-muted-foreground">جارٍ التحقّق من صلاحياتك…</p>
        </Section>
      </main>
    );
  }

  if (!user || !isAdmin) {
    return (
      <main>
        <Section className="pt-12">
          <div className="glass mx-auto max-w-md rounded-3xl p-8 text-center shadow-glass-lg">
            <ShieldOff className="mx-auto size-8 text-muted-foreground" />
            <h1 className="mt-4 text-xl font-bold text-foreground">هذه الصفحة للإدارة فقط</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {user
                ? "حسابك لا يملك صلاحية الإدارة."
                : "سجّل الدخول بحساب المدير للوصول إلى لوحة الإدارة."}
            </p>
            {!user && (
              <Link
                to="/auth"
                className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-soft"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </Section>
      </main>
    );
  }

  const members = membersQuery.data?.members ?? [];

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <ShieldCheck className="size-3.5" />
          لوحة الإدارة
        </span>
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">إدارة الأعضاء</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          امنح أي عضو صلاحية <strong>الإشراف</strong> لمساعدتك في إدارة المجتمع، أو صلاحية{" "}
          <strong>الإدارة</strong> الكاملة. يمكنك سحب الصلاحية في أي وقت.
        </p>

        {membersQuery.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">جارٍ تحميل الأعضاء…</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {members.map((m) => {
              const isMemberAdmin = m.roles.includes("admin");
              const isMemberMod = m.roles.includes("moderator");
              const self = m.id === user.id;
              return (
                <li key={m.id} className="glass rounded-2xl p-5 shadow-glass">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                      {m.full_name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                        {m.full_name}
                        {isMemberAdmin && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
                            <Star className="size-3" /> مدير
                          </span>
                        )}
                        {isMemberMod && (
                          <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            مشرف
                          </span>
                        )}
                      </p>
                      <p className="font-num mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">
                        {m.email}
                        {m.phone ? ` · ${m.phone}` : ""}
                      </p>
                    </div>
                    <span className="font-num text-sm font-bold text-primary">
                      {arabicNumber(m.total_points)} نقطة
                    </span>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <button
                        onClick={() =>
                          mutation.mutate({ userId: m.id, role: "moderator", grant: !isMemberMod })
                        }
                        disabled={mutation.isPending}
                        className="glass-soft inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-60"
                      >
                        <ShieldPlus className="size-4" />
                        {isMemberMod ? "سحب الإشراف" : "منح الإشراف"}
                      </button>
                      <button
                        onClick={() =>
                          mutation.mutate({ userId: m.id, role: "admin", grant: !isMemberAdmin })
                        }
                        disabled={mutation.isPending || (self && isMemberAdmin)}
                        title={self && isMemberAdmin ? "لا يمكنك سحب الإدارة من نفسك" : undefined}
                        className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary disabled:opacity-50"
                      >
                        <ShieldCheck className="size-4" />
                        {isMemberAdmin ? "سحب الإدارة" : "منح الإدارة"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </main>
  );
}
