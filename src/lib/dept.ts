export type Accent = "brand" | "sky" | "amber" | "violet";

type AccentStyle = {
  text: string;
  bg: string;
  bar: string;
  ring: string;
  soft: string;
  border: string;
};

const styles: Record<Accent, AccentStyle> = {
  brand: {
    text: "text-dept-ai",
    bg: "bg-dept-ai",
    bar: "bg-dept-ai",
    ring: "ring-dept-ai/30",
    soft: "bg-dept-ai/10",
    border: "border-dept-ai/60",
  },
  sky: {
    text: "text-dept-app",
    bg: "bg-dept-app",
    bar: "bg-dept-app",
    ring: "ring-dept-app/30",
    soft: "bg-dept-app/10",
    border: "border-dept-app/60",
  },
  amber: {
    text: "text-dept-security",
    bg: "bg-dept-security",
    bar: "bg-dept-security",
    ring: "ring-dept-security/30",
    soft: "bg-dept-security/10",
    border: "border-dept-security/60",
  },
  violet: {
    text: "text-dept-uiux",
    bg: "bg-dept-uiux",
    bar: "bg-dept-uiux",
    ring: "ring-dept-uiux/30",
    soft: "bg-dept-uiux/10",
    border: "border-dept-uiux/60",
  },
};

export function accentStyle(accent: string): AccentStyle {
  return styles[(accent as Accent) in styles ? (accent as Accent) : "brand"];
}

export const arabicNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

const easternDigits = "٠١٢٣٤٥٦٧٨٩";
const westernDigits = "0123456789";
const toLatinDigits = (s: string) =>
  s
    .split("")
    .map((c) => westernDigits[easternDigits.indexOf(c)] ?? c)
    .join("");

export const arabicDate = (iso: string) =>
  toLatinDigits(
    new Intl.DateTimeFormat("ar-EG", { dateStyle: "long" }).format(new Date(iso)),
  );
