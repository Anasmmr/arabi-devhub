import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Star, Users } from "lucide-react";
import { getMembers } from "@/lib/members.functions";
import { Section, SectionHead } from "@/components/site/Bits";
import { useSession } from "@/hooks/useSession";
import { arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/members")({
  loader: () => getMembers(),
  head: () => ({
    meta: [
      { title: "أعضاؤنا — Google Developer" },
      {
        name: "description",
        content:
          "قائمة أعضاء مجتمع Google Developer: المشرفون أولاً ثم بقية الأعضاء مع نقاطهم في لعبة المسارات.",
      },
      { property: "og:title", content: "أعضاؤنا — Google Developer" },
      {
        property: "og:description",
        content: "تعرّف على أعضاء المجتمع والمشرفين ونقاطهم في لعبة المسارات.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  const { members } = Route.useLoaderData();
  const { user } = useSession();

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="أعضاؤنا"
          title="أعضاء المجتمع"
          subtitle="كل من يسجّل الدخول للموقع يظهر هنا. المشرفون في المقدّمة، وهم من يضيف النقاط للمسارات."
        />

        {!user && (
          <div className="glass mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 shadow-glass">
            <p className="text-sm text-muted-foreground">
              سجّل الدخول ليظهر حسابك في قائمة الأعضاء.
            </p>
            <Link
              to="/auth"
              className="inline-flex rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary"
            >
              تسجيل الدخول
            </Link>
          </div>
        )}

        {members.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">لا يوجد أعضاء بعد.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {members.map((m) => (
              <li
                key={m.id}
                className="glass flex items-center gap-4 rounded-2xl p-4 shadow-glass sm:p-5"
              >
                {m.avatar_url ? (
                  <img
                    src={m.avatar_url}
                    alt={m.full_name}
                    loading="lazy"
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {m.full_name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-foreground">
                    {m.full_name}
                    {m.is_admin && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
                        <Star className="size-3" /> مدير
                      </span>
                    )}
                    {m.is_moderator && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        <ShieldCheck className="size-3" /> مشرف
                      </span>
                    )}
                    {m.id === user?.id && (
                      <span className="rounded-lg bg-glass px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        حسابك
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[m.headline, m.city].filter(Boolean).join(" · ") || "عضو في المجتمع"}
                  </p>
                </div>
                <span className="font-num shrink-0 text-sm font-bold text-primary">
                  {arabicNumber(m.total_points)} نقطة
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="size-4" />
          صلاحية الإشراف تُمنح من إدارة النادي فقط.
        </p>
      </Section>
    </main>
  );
}
