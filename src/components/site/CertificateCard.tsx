import { Award, Printer } from "lucide-react";
import { arabicDate } from "@/lib/dept";

export type CertificateItem = {
  id: string;
  serial: string;
  issued_at: string;
  course_title: string;
  department_name: string;
};

function printCertificate(cert: CertificateItem, holder: string) {
  const win = window.open("", "_blank", "width=1000,height=700");
  if (!win) return;
  win.document.write(`<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8" />
<title>شهادة ${cert.course_title}</title>
<style>
  body{margin:0;font-family:"IBM Plex Sans Arabic","Segoe UI",sans-serif;background:#f5f6fa;display:grid;place-items:center;min-height:100vh}
  .cert{width:900px;max-width:92vw;background:#fff;border:1px solid #dfe2ec;border-radius:24px;padding:56px;text-align:center;box-shadow:0 20px 60px rgba(30,40,80,.08)}
  .kicker{letter-spacing:.14em;font-size:12px;color:#5a6180;text-transform:uppercase}
  h1{margin:18px 0 6px;font-size:34px;color:#1b1f33}
  .name{margin:26px 0 6px;font-size:28px;font-weight:700;color:#3b4bdb}
  .course{font-size:20px;color:#1b1f33;margin-top:18px}
  .dept{color:#5a6180;margin-top:6px}
  .meta{margin-top:34px;display:flex;justify-content:space-between;font-size:13px;color:#5a6180;border-top:1px solid #e7e9f2;padding-top:18px}
  @media print{body{background:#fff}.cert{box-shadow:none;border-color:#c9cddd}}
</style></head><body><div class="cert">
  <div class="kicker">Google Developer Club</div>
  <h1>شهادة إتمام</h1>
  <div class="kicker">تُمنح هذه الشهادة إلى</div>
  <div class="name">${holder}</div>
  <div class="course">لإتمامه دورة: ${cert.course_title}</div>
  <div class="dept">قسم ${cert.department_name}</div>
  <div class="meta"><span>الرقم التسلسلي: ${cert.serial}</span><span>تاريخ الإصدار: ${arabicDate(cert.issued_at)}</span></div>
</div><script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}

export function CertificateCard({
  cert,
  holder,
}: {
  cert: CertificateItem;
  holder: string;
}) {
  return (
    <article className="glass-soft relative overflow-hidden rounded-2xl p-5">
      <span className="absolute -left-6 -top-6 size-20 rounded-full bg-primary/10" aria-hidden />
      <div className="relative flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Award className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">{cert.course_title}</p>
          <p className="mt-1 text-xs text-muted-foreground">قسم {cert.department_name}</p>
          <p className="font-num mt-2 text-[11px] text-muted-foreground" dir="ltr">
            {cert.serial}
          </p>
          <p className="font-num mt-0.5 text-[11px] text-muted-foreground">
            صدرت في {arabicDate(cert.issued_at)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => printCertificate(cert, holder)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-glass-border bg-background/60 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Printer className="size-3.5" />
        عرض / طباعة الشهادة
      </button>
    </article>
  );
}
