import { createFileRoute } from "@tanstack/react-router";
import { Github, Linkedin } from "lucide-react";
import { getFounders } from "@/lib/community.functions";
import { Section, SectionHead } from "@/components/site/Bits";

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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {founders.map((f) => (
            <article key={f.id} className="glass rounded-2xl p-6 text-center shadow-glass">
              <span className="mx-auto grid size-16 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {f.image_url ? (
                  <img
                    src={f.image_url}
                    alt={f.name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  f.initial
                )}
              </span>
              <h2 className="mt-4 text-base font-bold text-foreground">{f.name}</h2>
              <p className="mt-1 text-xs font-semibold text-primary">{f.role_ar}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.bio_ar}</p>
              <div className="mt-4 flex justify-center gap-2">
                {f.github_url && (
                  <a
                    href={f.github_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`GitHub ${f.name}`}
                    className="glass-soft grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Github className="size-4" />
                  </a>
                )}
                {f.linkedin_url && (
                  <a
                    href={f.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`LinkedIn ${f.name}`}
                    className="glass-soft grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Linkedin className="size-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}
