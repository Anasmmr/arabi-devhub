import type { ReactNode } from "react";
import { arabicNumber } from "@/lib/dept";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

export function Progress({ percent, className = "" }: { percent: number; className?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
      <div
        className={`h-full rounded-full bg-primary transition-[width] duration-700 ${className}`}
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function StatCard({ value, label }: { value: number | string; label: string }) {
  const renderValue = () => {
    if (typeof value === "number") return <span>{arabicNumber(value)}</span>;
    const match = value.match(/^([+\-]?)(\d+)([+\-]?)$/);
    if (!match) return <span>{value}</span>;
    const [, prefix, digits, suffix] = match;
    return (
      <>
        {prefix && <span>{prefix}</span>}
        <span className="font-num">{digits}</span>
        {suffix && <span>{suffix}</span>}
      </>
    );
  };
  return (
    <div className="glass rounded-2xl p-5 text-center shadow-glass">
      <p className="text-2xl font-bold text-primary sm:text-3xl">{renderValue()}</p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
    </div>
  );
}
