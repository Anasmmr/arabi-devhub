import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getDepartments } from "@/lib/community.functions";
import { Section, SectionHead } from "@/components/site/Bits";
import { DeptIcon } from "@/components/site/DeptIcon";
import { deptImage } from "@/lib/deptImages";
import { accentStyle, arabicNumber } from "@/lib/dept";

export const Route = createFileRoute("/departments/")({
  loader: () => getDepartments(),
  head: () => ({
    meta: [
      { title: "الأقسام — Google Developer" },
      {
        name: "description",
        content:
          "أقسام النادي: الذكاء الاصطناعي، تطوير التطبيقات، الأمن السيبراني، وتصميم واجهات المستخدم — لكل قسم مسار تعلّم ودورات ونقاط وشهادات.",
      },
      { property: "og:title", content: "الأقسام — Google Developer" },
      {
        property: "og:description",
        content: "اختر قسمك وابدأ مسار التعلّم مع دورات عملية ونقاط وشهادات موثّقة.",
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
          eyebrow="الأقسام"
          title="اختر القسم الذي يناسب طريقك"
          subtitle="كل قسم يبدأ من الأساسيات ويتدرّج نحو مشاريع تطبيقية، مع نقاط وشهادة لكل دورة."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {departments.map((d) => {
            const a = accentStyle(d.accent);
            return (
              <article
                key={d.id}
                className="glass group flex flex-col overflow-hidden rounded-2xl shadow-glass transition-transform duration-500 hover:-translate-y-1.5"
              >
                <img
                  src={deptImage(d.slug)}
                  alt={`قسم ${d.name_ar}`}
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
                      className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary"
                    >
                      ادخل القسم
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
