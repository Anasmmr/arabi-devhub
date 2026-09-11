import { createFileRoute } from "@tanstack/react-router";
import { getDepartments } from "@/lib/community.functions";
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
        content:
          "متابعة مجموع نقاط المسارات الأربعة ومعرفة الأعلى بينها.",
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

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="لوحة الصدارة"
          title="نقاط المسارات"
          subtitle="أعلى مسار حسب مجموع النقاط المكتسبة — العدّاد يبدأ من الصفر في بداية الموسم."
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d) => {
            const a = accentStyle(d.accent);
            return (
              <article
                key={d.id}
                className="glass relative flex flex-col overflow-hidden rounded-2xl shadow-glass transition-transform hover:-translate-y-1"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-1.5 ${a.bg}`}
                  aria-hidden
                />
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
                  <span
                    className={`grid size-12 place-items-center rounded-xl ${a.soft} ${a.text}`}
                  >
                    <DeptIcon name={d.icon} className="size-6" />
                  </span>
                  <h2 className="mt-4 text-center text-lg font-bold text-foreground">
                    {d.name_ar}
                  </h2>
                  <p
                    className={`font-num mt-3 text-4xl font-extrabold ${a.text}`}
                  >
                    ٠
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">نقطة</p>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
