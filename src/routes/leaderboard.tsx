import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/community.functions";
import { Section, SectionHead } from "@/components/site/Bits";
import { arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/leaderboard")({
  loader: () => getLeaderboard(),
  head: () => ({
    meta: [
      { title: "لوحة الصدارة — Google Developer" },
      {
        name: "description",
        content: "أعلى أعضاء نادي Google Developer بالنقاط المكتسبة من الدورات وتفاعل المجتمع.",
      },
      { property: "og:title", content: "لوحة الصدارة — Google Developer" },
      {
        property: "og:description",
        content: "الترتيب، الاسم، ومجموع النقاط لأعلى أعضاء المجتمع.",
      },
    ],
  }),
  component: Leaderboard,
});

function medal(rank: number) {
  if (rank === 1) return "bg-gold/20 text-gold";
  if (rank === 2) return "bg-silver/20 text-silver";
  if (rank === 3) return "bg-bronze/20 text-bronze";
  return "bg-primary/10 text-primary";
}

function Leaderboard() {
  const { leaderboard } = Route.useLoaderData();
  const top5 = leaderboard.slice(0, 5);
  const rest = leaderboard.slice(5);

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="لوحة الصدارة"
          title="أعلى 5 أعضاء بالنقاط"
          subtitle="النقاط تُحتسب من إكمال الدورات والتفاعل في مجموعات النادي عبر واتساب."
        />

        <ul className="mt-8 space-y-3">
          {top5.map((m) => (
            <li
              key={m.id}
              className="glass flex items-center gap-4 rounded-2xl p-4 shadow-glass transition-transform hover:-translate-y-1 sm:p-5"
            >
              <span
                className={`font-num grid size-10 shrink-0 place-items-center rounded-xl text-base font-bold ${medal(m.rank)}`}
              >
                {arabicNumber(m.rank)}
              </span>
              <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-base font-bold text-primary">
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
              <span className="min-w-0 flex-1 truncate text-base font-bold text-foreground">
                {m.full_name}
              </span>
              <span className="font-num shrink-0 text-base font-bold text-primary">
                {arabicNumber(m.total_points)} نقطة
              </span>
            </li>
          ))}
        </ul>

        {rest.length > 0 && (
          <>
            <div className="mt-10 flex items-center gap-2">
              <Trophy className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground">بقية الأعضاء</h2>
            </div>
            <ul className="mt-4 divide-y divide-glass-border overflow-hidden rounded-2xl bg-glass shadow-glass">
              {rest.map((m) => (
                <li key={m.id} className="flex items-center gap-4 px-4 py-3 sm:px-5">
                  <span className="font-num w-8 shrink-0 text-sm font-bold text-muted-foreground">
                    {arabicNumber(m.rank)}
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
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
                    {arabicNumber(m.total_points)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </main>
  );
}
