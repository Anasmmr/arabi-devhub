import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Publishable-key client for public, read-only community data. */
export function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Founder = Database["public"]["Tables"]["founders"]["Row"];

export type LeaderboardEntry = {
  id: string;
  rank: number;
  full_name: string;
  headline: string | null;
  city: string | null;
  avatar_url: string | null;
  total_points: number;
};

export async function fetchDepartmentsWithCourses() {
  const sb = publicClient();
  const [{ data: departments, error: dErr }, { data: courses, error: cErr }] = await Promise.all([
    sb.from("departments").select("*").order("sort_order"),
    sb.from("courses").select("*").order("sort_order"),
  ]);
  if (dErr) throw dErr;
  if (cErr) throw cErr;
  return (departments ?? []).map((d) => ({
    ...d,
    courses: (courses ?? []).filter((c) => c.department_id === d.id),
  }));
}

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const sb = publicClient();
  const { data, error } = await sb
    .from("profiles")
    .select("id, full_name, headline, city, avatar_url, total_points")
    .order("total_points", { ascending: false })
    .order("full_name")
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((p, i) => ({ ...p, rank: i + 1 }));
}

export async function fetchFounders() {
  const sb = publicClient();
  const { data, error } = await sb.from("founders").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchStats() {
  const sb = publicClient();
  const [certificates, coursesDone, courses] = await Promise.all([
    sb.from("certificates").select("id", { count: "exact", head: true }),
    sb.from("course_completions").select("id", { count: "exact", head: true }),
    sb.from("courses").select("id", { count: "exact", head: true }),
  ]);
  return {
    // إجمالي أعضاء المجتمع
    members: 1580,
    certificates: 3200 + (certificates.count ?? 0),
    completions: 1860 + (coursesDone.count ?? 0),
    courses: courses.count ?? 0,
    events: 64,
    workshops: 96,
  };
}
