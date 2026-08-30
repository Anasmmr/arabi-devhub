import { MessageCircle } from "lucide-react";

export const socials = [
  { label: "واتساب", handle: "مجموعة المجتمع", href: "https://chat.whatsapp.com/IRHXy5NxyiZLbHUxQrQymw", icon: MessageCircle },
  { label: "تيك توك", handle: "@googledev.ar", href: "https://tiktok.com/", icon: TikTokIcon },
] as const;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

/** Club social accounts — visible on the homepage and reused elsewhere. */
export function SocialGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="glass group flex items-center gap-3 rounded-2xl p-4 shadow-glass transition-transform hover:-translate-y-1"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <s.icon className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">{s.label}</span>
            <span className="block truncate text-xs text-muted-foreground">{s.handle}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          title={s.label}
          className="glass-soft grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <s.icon className="size-4" />
        </a>
      ))}
    </div>
  );
}
