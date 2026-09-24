import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Section } from "@/components/site/Bits";

const registrationFormUrl = "https://forms.gle/4u9dTKbaL3EcTpNN7";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — Google Developer" },
      {
        name: "description",
        content: "سجّل الدخول إلى نادي Google Developer لمتابعة نقاطك وشهاداتك.",
      },
      { property: "og:title", content: "تسجيل الدخول — Google Developer" },
      { property: "og:description", content: "تابع تقدّمك ونقاطك وشهاداتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/profile" });
  }, [loading, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("أهلاً بك مجددًا!");
      navigate({ to: "/profile" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر إكمال العملية.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/profile` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <main>
      <Section className="pt-10 sm:pt-16">
        <div className="mx-auto max-w-md">
          <div className="glass rounded-3xl p-6 shadow-glass-lg sm:p-8">
            <h1 className="text-2xl font-bold text-foreground">تسجيل الدخول</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              سجّل الدخول لمتابعة نقاطك، تقدّمك في الأقسام، وشهاداتك.
            </p>

            <button
              onClick={google}
              className="glass-soft mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              <span className="font-num font-bold text-primary">G</span>
              المتابعة عبر Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-glass-border" />
              أو بالبريد الإلكتروني
              <span className="h-px flex-1 bg-glass-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-foreground">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-semibold text-foreground">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-soft disabled:opacity-60"
              >
                <LogIn className="size-4" />
                دخول
              </button>
            </form>

            <a
              href={registrationFormUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block w-full text-center text-sm font-semibold text-primary hover:underline"
            >
              ليس لديك حساب؟ إنشاء حساب
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
