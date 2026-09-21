import { createFileRoute } from "@tanstack/react-router";
import { getFounders } from "@/lib/community.functions";
import { Section, SectionHead } from "@/components/site/Bits";
import { FounderCards } from "@/components/site/FounderCards";

export const Route = createFileRoute("/founders")({
  loader: () => getFounders(),
  head: () => ({
    meta: [
      { title: "المؤسسون — Google Developer" },
      {
        name: "description",
        content: "تعرّف على مؤسسي نادي Google Developer والفريق الذي يقود المجتمع وأقسامه.",
      },
      { property: "og:title", content: "المؤسسون — Google Developer" },
      { property: "og:description", content: "الفريق المؤسس لنادي Google Developer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Founders,
});

function Founders() {
  const { founders } = Route.useLoaderData();

  return (
    <main>
      <Section className="pt-8 sm:pt-12">
        <SectionHead
          eyebrow="المؤسسون"
          title="الفريق الذي بدأ المجتمع"
          subtitle="مجموعة من المطوّرين والمصمّمين المتطوّعين يقودون الأقسام والبرامج التدريبية."
        />
        <FounderCards founders={founders} className="mt-8" />
      </Section>
    </main>
  );
}
