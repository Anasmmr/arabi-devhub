import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/google-developers-logo.svg.asset.json";

export function Footer() {
  return (
    <footer className="mt-4 pb-24 lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-2xl p-6 shadow-glass sm:p-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoAsset.url}
                  alt="Google Developer"
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-xl object-contain"
                />
                <p className="font-bold text-foreground">Google Developer</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                مجتمع مطوّري Google في المنطقة — نتعلّم معًا، نُنجز معًا، ونتقدّم معًا.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">التنقّل</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="transition-colors hover:text-primary">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link to="/departments" className="transition-colors hover:text-primary">
                    الأقسام
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="transition-colors hover:text-primary">
                    لوحة الصدارة
                  </Link>
                </li>
                <li>
                  <Link to="/founders" className="transition-colors hover:text-primary">
                    المؤسسون
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">الأقسام</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: "ai" }}
                    className="transition-colors hover:text-primary"
                  >
                    ذكاء اصطناعي
                  </Link>
                </li>
                <li>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: "app" }}
                    className="transition-colors hover:text-primary"
                  >
                    تطوير التطبيقات
                  </Link>
                </li>
                <li>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: "security" }}
                    className="transition-colors hover:text-primary"
                  >
                    الأمن السيبراني
                  </Link>
                </li>
                <li>
                  <Link
                    to="/departments/$slug"
                    params={{ slug: "uiux" }}
                    className="transition-colors hover:text-primary"
                  >
                    تصميم UI/UX
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">تواصل معنا</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://wa.me/" className="transition-colors hover:text-primary">
                    واتساب
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" className="transition-colors hover:text-primary">
                    انستغرام
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" className="transition-colors hover:text-primary">
                    لينكدإن
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@googledeveloper.community"
                    className="transition-colors hover:text-primary"
                  >
                    بريد النادي
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-glass-border pt-5 text-xs text-muted-foreground">
            <p>© 2026 Google Developer Community — جميع الحقوق محفوظة.</p>
            <p className="font-num">Learn · Complete · Earn · Achieve</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
