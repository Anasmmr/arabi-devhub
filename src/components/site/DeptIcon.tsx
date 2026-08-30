import { Brain, Smartphone, ShieldCheck, PenTool, type LucideIcon } from "lucide-react";

const map: Record<string, LucideIcon> = {
  brain: Brain,
  smartphone: Smartphone,
  shield: ShieldCheck,
  pen: PenTool,
};

export function DeptIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Brain;
  return <Icon className={className} />;
}
