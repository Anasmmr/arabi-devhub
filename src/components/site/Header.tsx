import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Home, LayoutGrid, Trophy, User, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { getMyRoles } from "@/lib/admin.functions";


const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/departments", label: "الأقسام" },
  { to: "/leaderboard", label: "لوحة الصدارة" },
  { to: "/profile", label: "حسابي" },
  { to: "/about", label: "عن النادي" },
  { to: "/founders", label: "المؤسسون" },
] as const;

const mobileTabs = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/departments", label: "الأقسام", icon: LayoutGrid },
  { to: "/leaderboard", label: "الصدارة", icon: Trophy },
  { to: "/profile", label: "حسابي", icon: User },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const fetchRoles = useServerFn(getMyRoles);
  const { data: roles } = useQuery({
    queryKey: ["my-roles", user?.id],
    queryFn: () => fetchRoles(),
    enabled: Boolean(user),
  });


  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="glass mt-4 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 shadow-glass sm:px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="font-num grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30">
                G
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-bold text-foreground">
                  Google Developer
                </span>
                <span className="block text-[11px] text-muted-foreground">مجتمع المطورين</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 text-sm lg:flex">
              {links.map((l) => {
                const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={
                      active
                        ? "rounded-lg bg-primary/10 px-3 py-2 font-semibold text-primary"
                        : "rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-glass/70 hover:text-foreground"
                    }
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {roles?.isAdmin && (
                    <Link
                      to="/admin"
                      className="glass-soft inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-primary"
                    >
                      <ShieldCheck className="size-4" />
                      <span className="hidden sm:inline">الإدارة</span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="hidden rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink/90 sm:inline-flex"
                  >
                    لوحتي
                  </Link>

                  <button
                    onClick={signOut}
                    aria-label="تسجيل الخروج"
                    className="glass-soft grid size-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut className="size-4" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="inline-flex items-center rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-ink/90"
                >
                  تسجيل الدخول
                </Link>
              )}
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="القائمة"
                className="glass-soft grid size-9 place-items-center rounded-xl text-foreground lg:hidden"
              >
                {open ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {open && (
            <div className="glass reveal mt-2 rounded-2xl p-2 shadow-glass lg:hidden">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
        <div className="glass mx-3 mb-3 grid grid-cols-4 gap-1 rounded-2xl p-1.5 shadow-glass-lg">
          {mobileTabs.map((t) => {
            const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={
                  active
                    ? "flex flex-col items-center gap-1 rounded-xl bg-primary/10 py-2 text-[11px] font-semibold text-primary"
                    : "flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] text-muted-foreground"
                }
              >
                <Icon className="size-5" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
