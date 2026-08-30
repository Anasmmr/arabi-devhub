import { Instagram, Linkedin, MessageCircle, Send, Youtube } from "lucide-react";

export const socials = [
  { label: "X / تويتر", handle: "@GoogleDevAR", href: "https://x.com/", icon: XIcon },
  { label: "انستغرام", handle: "@googledev.ar", href: "https://instagram.com/", icon: Instagram },
  { label: "لينكدإن", handle: "Google Developer", href: "https://linkedin.com/", icon: Linkedin },
  { label: "واتساب", handle: "مجموعة المجتمع", href: "https://wa.me/", icon: MessageCircle },
  { label: "تيليجرام", handle: "قناة الإعلانات", href: "https://t.me/", icon: Send },
  { label: "يوتيوب", handle: "ورش مسجّلة", href: "https://youtube.com/", icon: Youtube },
] as const;

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.5L6 22H3l7.2-8.2L2 2h6.4l4.6 6.1L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z" />
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
