import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { Section } from "@/components/site/Bits";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "الدخول والتسجيل — Google Developer" },
      {
        name: "description",
        content: "أنشئ حسابك في نادي Google Developer أو سجّل الدخول لمتابعة نقاطك وشهاداتك.",
      },
      { property: "og:title", content: "الدخول والتسجيل — Google Developer" },
      { property: "og:description", content: "حساب واحد لتتبّع تقدّمك ونقاطك وشهاداتك." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`,
            data: { full_name: fullName, whatsapp_phone: phone },
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب — تحقّق من بريدك لتأكيد التسجيل.");

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("أهلاً بك مجددًا!");
        navigate({ to: "/profile" });
      }
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
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              حساب واحد لمتابعة نقاطك، تقدّمك في الأقسام، وشهاداتك.
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
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="text-xs font-semibold text-foreground">
                    الاسم الكامل
                  </label>
                  <input
                    id="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              )}
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
                {mode === "signin" ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
                {mode === "signin" ? "دخول" : "تسجيل"}
              </button>
            </form>

            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-5 w-full text-center text-sm font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب بالفعل؟ سجّل الدخول"}
            </button>
          </div>
        </div>
      </Section>
    </main>
  );
}
