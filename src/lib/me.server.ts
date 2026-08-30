import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { fetchDepartmentsWithCourses } from "./community.server";

type SB = SupabaseClient<Database>;

export function normalizePhone(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

export async function ensureProfile(sb: SB, userId: string, fallbackName?: string) {
  const { data } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) return data;
  const { data: created, error } = await sb
    .from("profiles")
    .insert({ id: userId, full_name: fallbackName?.trim() || "عضو جديد" })
    .select("*")
    .single();
  if (error) throw error;
  return created;
}

export async function buildDashboard(sb: SB, userId: string, fallbackName?: string) {
  const profile = await ensureProfile(sb, userId, fallbackName);
  const departments = await fetchDepartmentsWithCourses();

  const [{ data: completions }, { data: certificates }, { data: transactions }, ahead] =
    await Promise.all([
      sb.from("course_completions").select("course_id, completed_at").eq("user_id", userId),
      sb
        .from("certificates")
        .select("id, course_id, department_id, serial, status, email_sent, issued_at")
        .eq("user_id", userId)
        .order("issued_at", { ascending: false }),
      sb
        .from("point_transactions")
        .select("id, amount, reason_ar, kind, department_id, reference, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(30),
      sb
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gt("total_points", profile.total_points),
    ]);

  const doneIds = new Set((completions ?? []).map((c) => c.course_id));

  const departmentProgress = departments.map((d) => {
    const completed = d.courses.filter((c) => doneIds.has(c.id)).length;
    const points = (transactions ?? [])
      .filter((t) => t.department_id === d.id)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      id: d.id,
      slug: d.slug,
      name_ar: d.name_ar,
      accent: d.accent,
      icon: d.icon,
      total: d.courses.length,
      completed,
      percent: d.courses.length ? Math.round((completed / d.courses.length) * 100) : 0,
      points,
    };
  });

  const courseMeta = new Map(
    departments.flatMap((d) => d.courses.map((c) => [c.id, { course: c, department: d }] as const)),
  );

  return {
    profile,
    rank: (ahead.count ?? 0) + 1,
    departmentProgress,
    completedCourseIds: [...doneIds],
    transactions: transactions ?? [],
    certificates: (certificates ?? []).map((cert) => {
      const meta = courseMeta.get(cert.course_id);
      return {
        ...cert,
        course_title: meta?.course.title_ar ?? "دورة",
        department_name: meta?.department.name_ar ?? "",
        department_slug: meta?.department.slug ?? "",
      };
    }),
  };
}
