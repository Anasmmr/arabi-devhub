import { publicClient } from "./community.server";

export type MemberEntry = {
  id: string;
  full_name: string;
  headline: string | null;
  city: string | null;
  avatar_url: string | null;
  total_points: number;
  is_admin: boolean;
  is_moderator: boolean;
};

/** أعضاء المجتمع: المديرون ثم المشرفون ثم بقية الأعضاء حسب النقاط. */
export async function fetchMembersDirectory(): Promise<MemberEntry[]> {
  const sb = publicClient();
  const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
    sb
      .from("profiles")
      .select("id, full_name, headline, city, avatar_url, total_points")
      .order("total_points", { ascending: false })
      .order("full_name"),
    sb.from("user_roles").select("user_id, role"),
  ]);
  if (pErr) throw pErr;
  if (rErr) throw rErr;

  const rows = (profiles ?? []).map((p) => {
    const mine = (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role);
    return { ...p, is_admin: mine.includes("admin"), is_moderator: mine.includes("moderator") };
  });

  const weight = (m: MemberEntry) => (m.is_admin ? 0 : m.is_moderator ? 1 : 2);
  return rows.sort(
    (a, b) => weight(a) - weight(b) || b.total_points - a.total_points ||
      a.full_name.localeCompare(b.full_name, "ar"),
  );
}

/** مجموع النقاط المضافة لكل مسار. */
export async function fetchDepartmentScores(): Promise<Record<string, number>> {
  const sb = publicClient();
  const { data, error } = await sb.from("department_points").select("department_id, amount");
  if (error) throw error;
  const totals: Record<string, number> = {};
  for (const row of data ?? []) {
    totals[row.department_id] = (totals[row.department_id] ?? 0) + row.amount;
  }
  return totals;
}
